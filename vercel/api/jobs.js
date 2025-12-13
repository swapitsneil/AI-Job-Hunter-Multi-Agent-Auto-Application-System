/**
 * AI Job Hunter - Jobs API Endpoint
 * =================================
 *
 * This endpoint provides access to the scraped job listings.
 * It reads from /outputs/master_jobs.json and provides filtering capabilities.
 *
 * CRITICAL: All API keys use placeholders - NEVER commit real secrets
 */

import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';

/**
 * GET /api/jobs
 *
 * Returns filtered list of job postings
 *
 * Query Parameters:
 * - role: Filter by role/title keywords
 * - remote: Filter by remote jobs only (true/false)
 * - entry_level: Filter by entry-level jobs only (true/false)
 * - limit: Maximum number of results to return
 * - skip: Number of results to skip (for pagination)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Read jobs from file
    const jobsData = await readFile(process.cwd() + '/outputs/master_jobs.json', 'utf-8');
    let jobs = JSON.parse(jobsData);

    // Apply filters
    const roleFilter = searchParams.get('role');
    const remoteFilter = searchParams.get('remote');
    const entryLevelFilter = searchParams.get('entry_level');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = parseInt(searchParams.get('skip')) || 0;

    // Filter by role keywords
    if (roleFilter) {
      const roleLower = roleFilter.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(roleLower) ||
        job.description.toLowerCase().includes(roleLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(roleLower))
      );
    }

    // Filter by remote status
    if (remoteFilter !== null) {
      const remoteBool = remoteFilter.toLowerCase() === 'true';
      jobs = jobs.filter(job => job.is_remote === remoteBool);
    }

    // Filter by entry-level status
    if (entryLevelFilter !== null) {
      const entryLevelBool = entryLevelFilter.toLowerCase() === 'true';
      jobs = jobs.filter(job =>
        job.tags.includes('entry-level') ||
        job.tags.includes('junior') ||
        job.tags.includes('fresher')
      );
    }

    // Apply pagination
    const paginatedJobs = jobs.slice(skip, skip + limit);

    // Return response
    return NextResponse.json({
      success: true,
      data: paginatedJobs,
      meta: {
        total: jobs.length,
        returned: paginatedJobs.length,
        limit,
        skip
      },
      filters: {
        role: roleFilter || null,
        remote: remoteFilter ? remoteFilter.toLowerCase() === 'true' : null,
        entry_level: entryLevelFilter ? entryLevelFilter.toLowerCase() === 'true' : null
      }
    });

  } catch (error) {
    console.error('Error in jobs API:', error);

    // Handle specific error cases
    if (error.code === 'ENOENT') {
      return NextResponse.json({
        success: false,
        error: 'Jobs data not found. Please run the scraper first.',
        error_code: 'DATA_NOT_FOUND'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve jobs data',
      error_code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

/**
 * API Configuration
 */
export const config = {
  api: {
    // Disable body parser for GET requests
    bodyParser: false,
    // Response size limit
    responseLimit: '10mb'
  }
};