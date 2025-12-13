/**
 * AI Job Hunter - Apply API Endpoint
 * ==================================
 *
 * This endpoint triggers the job application pipeline by starting a Kestra workflow.
 * It accepts candidate data and job ID, then initiates the automated application process.
 *
 * CRITICAL: All API keys use placeholders - NEVER commit real secrets
 */

import { NextResponse } from 'next/server';

/**
 * POST /api/apply
 *
 * Triggers the job application pipeline
 *
 * Request Body:
 * {
 *   job_id: string (required) - ID of the job to apply for
 *   candidate: object (required) - Candidate information
 *   {
 *     name: string
 *     email: string
 *     resume: string
 *     profile: object
 *     id: string (optional)
 *   }
 * }
 */
export async function POST(request) {
  // Only allow POST method
  if (request.method !== 'POST') {
    return NextResponse.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.job_id || !body.candidate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: job_id and candidate are required',
          error_code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Validate candidate structure
    const { candidate } = body;
    if (!candidate.name || !candidate.email || !candidate.resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Candidate must include name, email, and resume',
          error_code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Prepare Kestra workflow execution request
    const kestraRequest = {
      namespace: 'ai_job_hunter',
      flowId: 'job_application_pipeline',
      inputs: {
        job_id: body.job_id,
        candidate: {
          ...candidate,
          // Ensure candidate has an ID
          id: candidate.id || `candidate_${Date.now()}`
        },
        // Add timestamp for tracking
        timestamp: new Date().toISOString()
      }
    };

    // Call Kestra API to start workflow
    const kestraResponse = await fetch('https://{{KESTRA_URL}}/api/v1/executions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer {{KESTRA_API_TOKEN}}',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kestraRequest)
    });

    if (!kestraResponse.ok) {
      const errorData = await kestraResponse.json();
      console.error('Kestra API error:', errorData);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to start application process',
          error_code: 'KESTRA_ERROR',
          details: errorData.message || 'Unknown Kestra error'
        },
        { status: kestraResponse.status }
      );
    }

    const kestraResult = await kestraResponse.json();

    // Return success response with execution details
    return NextResponse.json({
      success: true,
      data: {
        execution_id: kestraResult.id,
        status: kestraResult.state,
        workflow_id: kestraResult.flowId,
        namespace: kestraResult.namespace,
        started_at: kestraResult.startDate,
        polling_url: `https://{{KESTRA_URL}}/api/v1/executions/${kestraResult.id}`,
        web_url: `https://{{KESTRA_URL}}/ui/executions/${kestraResult.namespace}/${kestraResult.flowId}/${kestraResult.id}`
      },
      message: 'Job application process started successfully'
    });

  } catch (error) {
    console.error('Error in apply API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process application request',
        error_code: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/apply - Status check endpoint
 *
 * Check the status of a running application process
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get('execution_id');

  if (!executionId) {
    return NextResponse.json(
      { success: false, error: 'execution_id parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Check status from Kestra
    const kestraResponse = await fetch(`https://{{KESTRA_URL}}/api/v1/executions/${executionId}`, {
      headers: {
        'Authorization': 'Bearer {{KESTRA_API_TOKEN}}'
      }
    });

    if (!kestraResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Execution not found' },
        { status: 404 }
      );
    }

    const executionData = await kestraResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        execution_id: executionData.id,
        status: executionData.state,
        started_at: executionData.startDate,
        ended_at: executionData.endDate,
        duration: executionData.duration,
        logs_url: `https://{{KESTRA_URL}}/ui/executions/${executionData.namespace}/${executionData.flowId}/${executionData.id}/logs`
      }
    });

  } catch (error) {
    console.error('Error checking execution status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check execution status' },
      { status: 500 }
    );
  }
}

/**
 * API Configuration
 */
export const config = {
  api: {
    bodyParser: true,
    responseLimit: '5mb'
  }
};