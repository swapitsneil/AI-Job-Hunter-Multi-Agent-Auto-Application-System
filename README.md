# AI Job Hunter + Multi-Agent Auto-Application System

🚀 **Hackathon Submission for AI Assemble**

[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/node.js-20+-green.svg)](https://nodejs.org/)
[![Kestra](https://img.shields.io/badge/kestra-workflow-orange.svg)](https://kestra.io/)
[![Oumi](https://img.shields.io/badge/oumi-agents-purple.svg)](https://oumi.ai/)
[![Vercel](https://img.shields.io/badge/vercel-deploy-black.svg)](https://vercel.com/)

## 🎯 Problem Statement

Finding and applying for entry-level Data Analyst jobs is incredibly time-consuming:

- **Manual Search**: Candidates spend hours across multiple job boards
- **Generic Applications**: One-size-fits-all resumes and cover letters get ignored
- **Missed Opportunities**: Great jobs get overlooked in the noise
- **Application Fatigue**: The process is demoralizing and inefficient

## ✨ Our Solution

**AI Job Hunter** is an intelligent, automated system that:

1. **Scrapes** 9+ job boards for Data Analyst roles (entry-level, remote)
2. **Filters** jobs using strict keyword matching (role + experience + remote)
3. **Analyzes** each job posting with AI agents
4. **Optimizes** resumes to match specific job requirements
5. **Generates** tailored cover letters for each application
6. **Automates** the entire application process

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Scraping** | Python, BeautifulSoup, Playwright | Extract job listings from 9+ sites |
| **Workflow** | Kestra | Orchestrate the multi-agent pipeline |
| **AI Agents** | Oumi + Mistral AI | Job analysis, resume optimization, cover letters |
| **Backend** | Vercel, Node.js | API endpoints for job listing and applications |
| **CI/CD** | CodeRabbit | Automated testing and deployment |
| **LLM** | mistralai/devstral-2512:free | All AI-powered analysis and generation |

## 🚀 Getting Started

### Prerequisites

```bash
# Python 3.11+
python --version

# Node.js 20+
node --version

# Required Python packages
pip install beautifulsoup4 playwright requests pyyaml

# Required Node.js packages
npm install eslint
```

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/your-repo/ai-job-hunter.git
cd ai-job-hunter
```

2. **Set up environment variables**:

Create a `.env` file:

```env
# Kestra Configuration
KESTRA_URL=https://your-kestra-instance.com
KESTRA_API_TOKEN={{KESTRA_API_TOKEN}}

# Oumi Configuration
OUMI_BASE_URL=https://your-oumi-instance.com
OUMI_API_KEY={{OUMI_API_KEY}}

# Mistral AI Configuration
MISTRAL_API_KEY={{MISTRAL_API_KEY}}

# Vercel Configuration
VERCEL_API_TOKEN={{VERCEL_API_TOKEN}}
```

3. **Install dependencies**:

```bash
# Python dependencies
pip install -r requirements.txt

# Node.js dependencies
npm install
```

### Running the System

1. **Run the job scraper**:

```bash
cd scrapers
python job_scraper.py
```

2. **Start the Kestra workflow**:

```bash
# Trigger via API or Kestra UI
curl -X POST https://{{KESTRA_URL}}/api/v1/executions \
  -H "Authorization: Bearer {{KESTRA_API_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "ai_job_hunter",
    "flowId": "job_application_pipeline",
    "inputs": {
      "job_id": "job_123",
      "candidate": {
        "name": "John Doe",
        "email": "john@example.com",
        "resume": "Your resume text here..."
      }
    }
  }'
```

3. **Access the Vercel API**:

```bash
# Get job listings
curl https://your-vercel-app.com/api/jobs?role=data%20analyst&remote=true

# Start application process
curl -X POST https://your-vercel-app.com/api/apply \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "job_123",
    "candidate": {
      "name": "John Doe",
      "email": "john@example.com",
      "resume": "Your resume text here..."
    }
  }'
```

## 📁 Project Structure

```
AI-Job-Hunter/
├── scrapers/                  # Job scraping modules
│   └── job_scraper.py         # Main scraper with 9 site integrations
├── kestra/                    # Workflow orchestration
│   └── workflows/
│       └── main.yaml          # Kestra workflow definition
├── oumi/                      # Multi-agent system
│   ├── agents.yaml            # Agent configurations
│   └── templates/            # Prompt templates
├── vercel/                    # Backend API
│   └── api/
│       ├── jobs.js            # Jobs listing endpoint
│       └── apply.js           # Application trigger endpoint
├── outputs/                   # Generated files
│   ├── master_jobs.json       # Scraped job listings
│   └── {job_slug}/           # Application artifacts
├── docs/                      # Documentation
│   └── architecture.md        # System architecture
├── .coderabbit.yml            # CI/CD configuration
└── README.md                  # This file
```

## 🤖 AI Agents

### 1. JobAnalyzerAgent
- **Input**: Job posting data
- **Output**: Structured analysis of requirements, skills, experience
- **Model**: mistralai/devstral-2512:free

### 2. ResumeOptimizerAgent
- **Input**: Job analysis + candidate resume
- **Output**: Optimized resume tailored to the job
- **Model**: mistralai/devstral-2512:free

### 3. CoverLetterAgent
- **Input**: Job + optimized resume + candidate profile
- **Output**: Professional, tailored cover letter
- **Model**: mistralai/devstral-2512:free

## 🎯 Target Job Sites

1. [RemoteOK](https://remoteok.com/remote-data-analyst-jobs)
2. [We Work Remotely](https://weworkremotely.com/)
3. [FlexJobs](https://www.flexjobs.com/remote-jobs/computer-it)
4. [Remote.co](https://remote.co/remote-jobs/entry-level)
5. [Remotive](https://remotive.com/remote-jobs/data)
6. [Working Nomads](https://www.workingnomads.com/jobs)
7. [NodeSk](https://nodesk.co/remote-jobs/entry-level/)
8. [Wellfound](https://wellfound.com/remote)
9. [Arc.dev](https://arc.dev/remote-jobs/data-analytics)

## 🔍 Filtering Criteria

**Role Keywords**: `data analyst`, `data`, `analyst`, `junior data analyst`, `associate data analyst`

**Entry-Level Keywords**: `entry level`, `entry-level`, `fresher`, `junior`, `0-1 years`, `0-2 years`, `graduate`

**Remote Keywords**: `remote`, `anywhere`, `work from anywhere`, `fully remote`, `remote-only`

## 📊 Sample Output

```json
{
  "title": "Junior Data Analyst (Remote)",
  "company": "TechCorp Inc.",
  "location": "Anywhere (Remote)",
  "tags": ["entry-level", "remote", "data", "analyst"],
  "job_url": "https://example.com/jobs/junior-data-analyst-001",
  "description": "We are looking for a Junior Data Analyst...",
  "skills": ["Python", "SQL", "Excel", "Data Visualization", "Statistics"],
  "source": "remoteok",
  "date_posted": "2024-03-15",
  "salary": "$50,000 - $65,000",
  "is_remote": true,
  "match_reasons": {
    "role_keywords": ["data analyst", "analyst"],
    "entry_keywords": ["entry-level", "junior"],
    "remote_keywords": ["remote"]
  }
}
```

## 🚀 Live Demo

🔗 **[Live Demo](https://ai-job-hunter.vercel.app)** *(Placeholder - replace with actual URL)*



## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) for providing devstral-2512:free
- [Kestra](https://kestra.io/) for workflow orchestration
- [Oumi](https://oumi.ai/) for multi-agent framework
- [Vercel](https://vercel.com/) for hosting
- [CodeRabbit](https://coderabbit.ai/) for CI/CD

---

**CRITICAL SECURITY NOTE**: This project uses placeholder API keys (`{{KEY_NAME}}`). Never commit real secrets to version control. Use environment variables or secret management systems for production deployment.
