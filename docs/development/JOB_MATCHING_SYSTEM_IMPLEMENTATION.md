# AI-Powered Job Matching & Preparation System
## Implementation Guide for South African Job Market

---

## 📋 **System Overview**

This system helps users **find, match, and prepare for employment** using:
- **Web scraping** from South African and international job boards
- **AI-powered matching** based on resume and preferences
- **Interview preparation** with personalized questions and answers
- **Skill gap analysis** with learning recommendations
- **Career path suggestions** and salary insights

---

## 🏗️ **Architecture**

### **Data Flow**
```
Job Boards → Scrapers → Database → Matcher → User Dashboard
                                      ↓
                                   AI Agent
                                      ↓
                            Preparation Materials
```

### **Components**

#### **1. Web Scraping Layer**
```
lib/services/jobs/scrapers/
├── south-african/
│   ├── pnet-scraper.ts          ✅ Created
│   ├── career-junction-scraper.ts
│   ├── job-mail-scraper.ts
│   └── gumtree-jobs-scraper.ts
├── international/
│   ├── indeed-scraper.ts        ✅ Exists (stub)
│   ├── linkedin-scraper.ts      ✅ Exists (stub)
│   └── glassdoor-scraper.ts
└── scraper-factory.ts           ✅ Exists
```

#### **2. AI Preparation Layer**
```
lib/ai/
├── job-preparation-agent.ts     ✅ Created
├── resume-agent.ts              ✅ Exists
└── cover-letter-agent.ts        ✅ Exists
```

#### **3. API Layer**
```
app/api/jobs/
├── scrape/route.ts              ✅ Exists
├── matches/route.ts             ✅ Exists
├── prepare/route.ts             ✅ Created
├── applications/route.ts        ✅ Exists
└── preferences/route.ts         ✅ Exists
```

#### **4. UI Layer**
```
components/jobs/
├── job-preparation-panel.tsx    ✅ Created
├── job-match-card.tsx           ✅ Exists
├── application-tracker.tsx      ✅ Exists
└── job-preferences-form.tsx     ✅ Exists
```

---

## 🚀 **Implementation Roadmap**

### **Phase 1: Enhanced Web Scraping** (Week 1-2)

#### **1.1 Install Dependencies**
```bash
pnpm add cheerio puppeteer playwright
pnpm add -D @types/cheerio
```

#### **1.2 Implement South African Scrapers**

**Priority Job Boards:**
1. **PNet** (✅ Created) - Largest SA job board
2. **CareerJunction** - Professional roles
3. **JobMail** - Entry to mid-level
4. **Gumtree Jobs** - Diverse opportunities
5. **Indeed ZA** - International + local

**Implementation Pattern:**
```typescript
// lib/services/jobs/scrapers/career-junction-scraper.ts
import * as cheerio from 'cheerio';
import type { JobScraper } from '../scraper.interface';

export class CareerJunctionScraper implements JobScraper {
  source = 'careerjunction';
  baseUrl = 'https://www.careerjunction.co.za';

  async search(query: JobSearchQuery): Promise<Job[]> {
    // 1. Build search URL with SA-specific params
    // 2. Fetch HTML (use Puppeteer if JS-heavy)
    // 3. Parse with Cheerio
    // 4. Extract job data
    // 5. Handle pagination
    // 6. Return structured jobs
  }

  async getJobDetails(url: string): Promise<Job> {
    // Fetch full job description
    // Extract requirements, salary (ZAR), benefits
    // Handle SA-specific fields (BEE, work permit)
  }
}
```

#### **1.3 Update Scraper Factory**
```typescript
// lib/services/jobs/scraper-factory.ts
import { PNetScraper } from './scrapers/pnet-scraper';
import { CareerJunctionScraper } from './scrapers/career-junction-scraper';

export function getScraper(source: string): JobScraper {
  switch (source) {
    case 'pnet': return new PNetScraper();
    case 'careerjunction': return new CareerJunctionScraper();
    case 'jobmail': return new JobMailScraper();
    // ... more scrapers
    default: throw new Error(`Unknown source: ${source}`);
  }
}
```

#### **1.4 Background Job Processing**
```typescript
// lib/services/jobs/scraper-scheduler.ts
export async function scheduleJobScraping() {
  // Run every 6 hours
  // Scrape from all sources
  // Update database
  // Trigger matching for users with preferences
}
```

---

### **Phase 2: AI-Powered Preparation** (Week 3-4)

#### **2.1 Interview Preparation** ✅ Created
- Generate role-specific questions
- Provide STAR framework answers
- Company-specific insights
- Mock interview scenarios

#### **2.2 Skill Gap Analysis** ✅ Created
- Compare resume skills vs job requirements
- Prioritize missing skills (high/medium/low)
- Recommend learning resources (Coursera, Udemy, YouTube)
- Track skill development progress

#### **2.3 Career Path Suggestions** ✅ Created
- Analyze current career level
- Suggest next 3 career steps
- Provide timeframes and required skills
- Industry trend analysis

#### **2.4 Company Research** ✅ Created
- Company overview and culture
- Recent news and developments
- Interview tips specific to company
- Questions to ask interviewer

#### **2.5 Salary Insights** ✅ Created
- Market rate for role in SA
- Negotiation tips
- Justification based on experience
- Cost of living adjustments

---

### **Phase 3: Enhanced Matching** (Week 5)

#### **3.1 Improve Matching Algorithm**
```typescript
// lib/services/jobs/enhanced-matcher.ts
export function calculateEnhancedMatchScore(
  job: Job,
  resume: Resume,
  preferences: JobPreferences,
  userHistory: JobApplication[]
): MatchResult {
  // Current: 40% skills, 15% location, 15% job type, 20% experience, 10% salary
  
  // Add:
  // - Industry preference matching (10%)
  // - Company culture fit (5%)
  // - Growth potential (5%)
  // - Commute time (5%)
  // - Application success rate (5%)
  // - User feedback on similar jobs (5%)
}
```

#### **3.2 Machine Learning Integration**
```typescript
// lib/services/jobs/ml-matcher.ts
// Use user's application history to improve matching
// Track which jobs they apply to vs reject
// Learn preferences over time
// Collaborative filtering (similar users)
```

---

### **Phase 4: User Experience** (Week 6)

#### **4.1 Job Discovery Dashboard**
```typescript
// app/resumes/[id]/jobs/discover/page.tsx
export default function JobDiscoveryPage() {
  return (
    <div>
      {/* Smart filters */}
      {/* Match score visualization */}
      {/* One-click apply */}
      {/* Save for later */}
      {/* AI recommendations */}
    </div>
  );
}
```

#### **4.2 Preparation Workflow**
```
Job Match → View Details → Prepare → Apply
                              ↓
                    [Interview Prep]
                    [Skill Gap Analysis]
                    [Company Research]
                    [Salary Insights]
                    [Cover Letter Generator]
```

#### **4.3 Application Tracking**
```typescript
// Enhanced application tracker with:
// - Timeline view
// - Status updates
// - Interview reminders
// - Follow-up suggestions
// - Success analytics
```

---

## 🔧 **Technical Implementation**

### **Web Scraping Best Practices**

#### **1. Rate Limiting**
```typescript
// lib/services/jobs/rate-limiter.ts
export class RateLimiter {
  private delays = new Map<string, number>();

  async throttle(source: string, minDelay: number = 1000) {
    const lastRequest = this.delays.get(source) || 0;
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequest;
    
    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, minDelay - timeSinceLastRequest)
      );
    }
    
    this.delays.set(source, Date.now());
  }
}
```

#### **2. Error Handling**
```typescript
// Retry logic with exponential backoff
async function scrapeWithRetry(
  scraper: JobScraper,
  query: JobSearchQuery,
  maxRetries: number = 3
): Promise<Job[]> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await scraper.search(query);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  return [];
}
```

#### **3. Proxy Rotation** (Optional)
```typescript
// Use rotating proxies to avoid IP blocks
const proxies = [
  'http://proxy1.example.com:8080',
  'http://proxy2.example.com:8080',
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}
```

#### **4. Puppeteer for Dynamic Content**
```typescript
// lib/services/jobs/puppeteer-scraper.ts
import puppeteer from 'puppeteer';

export async function scrapeDynamicPage(url: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.job-listing'); // Wait for content
  
  const html = await page.content();
  await browser.close();
  
  return html;
}
```

---

### **AI Integration Best Practices**

#### **1. Prompt Engineering**
```typescript
// Use structured prompts for consistent output
const INTERVIEW_PREP_PROMPT = `
You are an expert career coach. Generate interview preparation for:

Job: {title} at {company}
Requirements: {requirements}
Candidate: {resume_summary}

Output JSON with:
{
  "commonQuestions": [{"question": "", "suggestedAnswer": ""}],
  "technicalQuestions": [{"question": "", "hints": []}],
  "behavioralQuestions": [{"question": "", "starFramework": ""}]
}
`;
```

#### **2. Caching**
```typescript
// Cache AI responses to reduce costs
const cache = new Map<string, any>();

async function getCachedAIResponse(
  key: string,
  generator: () => Promise<any>
): Promise<any> {
  if (cache.has(key)) return cache.get(key);
  
  const result = await generator();
  cache.set(key, result);
  
  return result;
}
```

#### **3. Streaming Responses**
```typescript
// Stream AI responses for better UX
import { streamText } from 'ai';

export async function streamInterviewPrep(job: Job, resume: Resume) {
  const stream = await streamText({
    model: getModel(),
    prompt: buildPrompt(job, resume),
  });

  return stream.toDataStreamResponse();
}
```

---

## 📊 **Database Schema Updates**

### **Add Job Insights Table**
```sql
CREATE TABLE job_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_research TEXT,
  salary_insights JSONB,
  interview_tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_insights_job ON job_insights(job_id);
```

### **Add User Preparation History**
```sql
CREATE TABLE user_preparation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  preparation_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prep_history_user ON user_preparation_history(user_id);
```

---

## 🎯 **Usage Examples**

### **1. Scrape Jobs**
```typescript
// Trigger scraping
const response = await fetch('/api/jobs/scrape', {
  method: 'POST',
  body: JSON.stringify({
    sources: ['pnet', 'careerjunction', 'indeed'],
    query: {
      query: 'software developer',
      location: 'Cape Town',
      jobType: 'full-time',
      limit: 100,
    },
  }),
});
```

### **2. Get Job Matches**
```typescript
// Get personalized matches
const matches = await fetch('/api/jobs/matches?resumeId=123&minScore=70');
```

### **3. Generate Interview Prep**
```typescript
// Get AI-powered preparation
const prep = await fetch('/api/jobs/prepare', {
  method: 'POST',
  body: JSON.stringify({
    jobId: 'job-123',
    resumeId: 'resume-456',
    type: 'interview',
  }),
});
```

### **4. Analyze Skill Gap**
```typescript
const analysis = await fetch('/api/jobs/prepare', {
  method: 'POST',
  body: JSON.stringify({
    jobId: 'job-123',
    resumeId: 'resume-456',
    type: 'skill-gap',
  }),
});
```

---

## 🔐 **Security & Compliance**

### **1. Respect robots.txt**
```typescript
// Check robots.txt before scraping
import { RobotsTxtParser } from 'robots-txt-parser';

async function canScrape(url: string): Promise<boolean> {
  const parser = new RobotsTxtParser();
  await parser.setUrl(`${new URL(url).origin}/robots.txt`);
  return parser.isAllowed(url, 'MyBot');
}
```

### **2. User Agent**
```typescript
// Always identify your bot
const headers = {
  'User-Agent': 'PhandiSpan-JobBot/1.0 (+https://phandispan.com/bot)',
};
```

### **3. Rate Limiting**
- Max 1 request per second per domain
- Respect Retry-After headers
- Implement exponential backoff

### **4. Data Privacy**
- Store only necessary job data
- Anonymize user data in analytics
- GDPR/POPIA compliance for SA users

---

## 📈 **Performance Optimization**

### **1. Caching Strategy**
```typescript
// Cache job listings for 6 hours
// Cache company research for 7 days
// Cache salary insights for 30 days
```

### **2. Database Indexing**
```sql
-- Already created in migration
CREATE INDEX idx_jobs_source ON jobs(source);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX idx_job_matches_score ON job_matches(match_score DESC);
```

### **3. Background Processing**
```typescript
// Use queue for scraping (e.g., BullMQ, Inngest)
// Process matches asynchronously
// Send notifications via webhooks
```

---

## 🧪 **Testing Strategy**

### **1. Scraper Tests**
```typescript
describe('PNetScraper', () => {
  it('should extract job listings', async () => {
    const scraper = new PNetScraper();
    const jobs = await scraper.search({ query: 'developer', limit: 10 });
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0]).toHaveProperty('title');
  });
});
```

### **2. Matcher Tests**
```typescript
describe('JobMatcher', () => {
  it('should calculate match score correctly', () => {
    const score = calculateMatchScore(mockJob, mockResume, mockPreferences);
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
  });
});
```

### **3. AI Tests**
```typescript
describe('JobPreparationAgent', () => {
  it('should generate interview questions', async () => {
    const prep = await generateInterviewPrep(mockJob, mockResume);
    expect(prep.commonQuestions).toHaveLength(5);
  });
});
```

---

## 📱 **Mobile Optimization**

### **1. Responsive Design**
- Job cards stack on mobile
- Swipeable job carousel
- Bottom sheet for job details
- Quick apply button

### **2. Progressive Web App**
```typescript
// Add to manifest.json
{
  "name": "Phandi Span Job Finder",
  "short_name": "JobFinder",
  "start_url": "/jobs",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

---

## 🚀 **Deployment Checklist**

- [ ] Install scraping dependencies (cheerio, puppeteer)
- [ ] Implement all SA job board scrapers
- [ ] Set up background job scheduler
- [ ] Configure rate limiting
- [ ] Add error monitoring (Sentry)
- [ ] Set up caching (Redis)
- [ ] Test AI preparation features
- [ ] Optimize database queries
- [ ] Add analytics tracking
- [ ] Deploy to production
- [ ] Monitor scraping success rates
- [ ] Gather user feedback

---

## 📚 **Resources**

### **South African Job Boards**
- [PNet](https://www.pnet.co.za) - Largest SA job board
- [CareerJunction](https://www.careerjunction.co.za) - Professional roles
- [JobMail](https://www.jobmail.co.za) - Entry to mid-level
- [Gumtree Jobs](https://www.gumtree.co.za/jobs) - Diverse opportunities

### **Web Scraping**
- [Cheerio Documentation](https://cheerio.js.org/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Playwright Documentation](https://playwright.dev/)

### **AI Integration**
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Google Gemini](https://ai.google.dev/)

---

## 🎉 **Next Steps**

1. **Install dependencies**: `pnpm add cheerio puppeteer`
2. **Implement scrapers**: Start with PNet (already created)
3. **Test scraping**: Run `/api/jobs/scrape` endpoint
4. **Test AI prep**: Use JobPreparationPanel component
5. **Integrate into UI**: Add to job match pages
6. **Deploy**: Push to production
7. **Monitor**: Track scraping success and user engagement

---

**Status**: ✅ Foundation Complete - Ready for Implementation
**Version**: 1.0.0
**Last Updated**: January 17, 2026
