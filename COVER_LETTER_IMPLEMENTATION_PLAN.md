# Cover Letter Editor/Generator Implementation Plan

## Executive Summary
Create a complete Cover Letter Editor/Generator with AI-powered generation, real-time editing, PDF export, and agentic workflows. This will mirror the resume editor architecture while being optimized for cover letter creation.

---

## Current State Analysis

### ✅ Already Implemented
1. **Data Models** (`lib/models/job.ts`)
   - `CoverLetter` schema with user_id, job_id, resume_id, content, template
   
2. **AI Agent** (`lib/ai/cover-letter-agent.ts`)
   - Agent with instructions for professional cover letter writing
   - Memory system with InMemoryProvider
   
3. **AI Tools** (`lib/ai/cover-letter-tools.ts`)
   - `getJobDetails` - Fetch job information
   - `getResumeContext` - Get resume data
   - `generateCoverLetter` - Initiate generation
   - `saveCoverLetter` - Save to database
   
4. **API Routes**
   - `/api/cover-letters/route.ts` - Basic POST endpoint
   - `/api/resumes/cover-letters/[coverLetterId]/route.ts` - Individual cover letter operations
   
5. **Database Client** (`lib/supabase/jobs-client.ts`)
   - `createCoverLetter`, `getCoverLetter` functions
   
6. **Basic Viewer** (`components/jobs/cover-letter-viewer.tsx`)
   - Simple text display with download

### ❌ Missing Components
1. **No dedicated editor page** (like `/dashboard/resumes/[id]/edit`)
2. **No real-time AI chat integration** for cover letters
3. **No PDF export** for cover letters
4. **No template system** for different cover letter styles
5. **No storage layer** for client-side cover letters
6. **No WYSIWYG editor** for cover letter editing
7. **No proper AI agent integration** with streaming
8. **No context management** for cover letter chat

---

## Architecture Design

### File Structure
```
app/
├── dashboard/
│   └── cover-letters/
│       ├── new/
│       │   └── page.tsx                    # NEW: Create cover letter (select job + resume)
│       └── [id]/
│           ├── page.tsx                    # NEW: View cover letter details
│           └── edit/
│               └── page.tsx                # NEW: Edit cover letter with AI

components/
├── cover-letter/
│   ├── editor.tsx                          # NEW: Rich text editor
│   ├── viewer.tsx                          # ENHANCE: PDF-ready viewer
│   ├── template-selector.tsx              # NEW: Template selection
│   ├── export-button.tsx                  # NEW: PDF/DOCX export
│   └── realtime-viewer.tsx                # NEW: Live preview during AI generation
└── chat/
    └── cover-letter-chat.tsx              # NEW: AI chat for cover letters

lib/
├── models/
│   └── cover-letter.ts                    # NEW: Extended model with metadata
├── storage/
│   ├── cover-letter-store.ts             # NEW: Client-side storage
│   └── cover-letter-store-server.ts      # NEW: Server-side storage
├── ai/
│   ├── cover-letter-agent.ts             # ENHANCE: Use ToolLoopAgent
│   ├── cover-letter-tools.ts             # ENHANCE: Add more tools
│   └── cover-letter-prompts.ts           # NEW: Structured prompts
├── contexts/
│   └── cover-letter-chat-context.tsx     # NEW: Chat context provider
├── hooks/
│   └── use-cover-letter-editor.ts        # NEW: Editor state management
└── utils/
    └── cover-letter-export.tsx           # NEW: PDF generation

app/api/
├── cover-letters/
│   ├── route.ts                          # ENHANCE: Add streaming
│   └── [id]/
│       └── route.ts                      # NEW: CRUD operations
└── cover-letter-chat/
    └── route.ts                          # NEW: AI chat endpoint
```

---

## Implementation Plan

### Phase 1: Core Data Layer (Foundation)

#### 1.1 Enhanced Cover Letter Model
**File:** `lib/models/cover-letter.ts`
```typescript
- Extend existing schema with metadata
- Add template types (professional, creative, concise, technical)
- Add status tracking (draft, generated, edited, finalized)
- Add version history support
```

#### 1.2 Storage Layer
**Files:** 
- `lib/storage/cover-letter-store.ts` (client)
- `lib/storage/cover-letter-store-server.ts` (server)
```typescript
- CRUD operations for cover letters
- Template management
- Version history
- Link to job and resume
```

---

### Phase 2: AI Agent Enhancement

#### 2.1 Upgrade to ToolLoopAgent
**File:** `lib/ai/cover-letter-agent.ts`
```typescript
- Migrate from Agent to ToolLoopAgent
- Add call options for dynamic configuration
- Implement workflow patterns (sequential, evaluation)
- Add structured output for cover letter sections
```

#### 2.2 Enhanced Tools
**File:** `lib/ai/cover-letter-tools.ts`
```typescript
NEW TOOLS:
- analyzeToneMatch: Compare job posting tone with cover letter
- suggestImprovements: Provide specific enhancement suggestions
- extractKeywords: Pull important keywords from job description
- checkLength: Ensure appropriate length (250-400 words)
- validateStructure: Check for proper opening/body/closing
```

#### 2.3 Structured Prompts
**File:** `lib/ai/cover-letter-prompts.ts`
```typescript
- Template-specific prompts
- Workflow stage prompts
- Evaluation criteria
- Improvement suggestions
```

---

### Phase 3: UI Components

#### 3.1 Cover Letter Editor
**File:** `components/cover-letter/editor.tsx`
```typescript
- Rich text editor (similar to resume WYSIWYG)
- Section-based editing (opening, body, closing)
- Real-time character/word count
- Template switching
- Auto-save functionality
```

#### 3.2 AI Chat Integration
**File:** `components/chat/cover-letter-chat.tsx`
```typescript
- Mirror resume-chat.tsx structure
- Tool invocation rendering
- Streaming support
- Approval workflow for regeneration
```

#### 3.3 Template System
**File:** `components/cover-letter/template-selector.tsx`
```typescript
TEMPLATES:
- Professional: Traditional corporate
- Creative: Storytelling approach
- Concise: Brief and direct
- Technical: For technical roles
```

#### 3.4 PDF Export
**File:** `lib/utils/cover-letter-export.tsx`
```typescript
- @react-pdf/renderer integration
- Multiple format support (PDF, DOCX, TXT)
- Professional formatting
- Template-specific styling
```

---

### Phase 4: Pages & Routes

#### 4.1 Create Page
**File:** `app/dashboard/cover-letters/new/page.tsx`
```typescript
WORKFLOW:
1. Select job (from matches or manual entry)
2. Select resume
3. Choose template
4. Generate with AI or start from scratch
5. Redirect to editor
```

#### 4.2 Edit Page
**File:** `app/dashboard/cover-letters/[id]/edit/page.tsx`
```typescript
FEATURES:
- Split view: Editor + AI Chat
- Resizable panels
- Real-time preview
- Template switching
- Export options
- Auto-save
```

#### 4.3 View Page
**File:** `app/dashboard/cover-letters/[id]/page.tsx`
```typescript
FEATURES:
- Read-only view
- PDF preview
- Edit button
- Export options
- Regenerate option
- Link to job and resume
```

---

### Phase 5: API Endpoints

#### 5.1 Chat Endpoint
**File:** `app/api/cover-letter-chat/route.ts`
```typescript
- Use createAgentUIStreamResponse
- Pass cover letter context
- Support tool execution
- Handle streaming
```

#### 5.2 CRUD Endpoint
**File:** `app/api/cover-letters/[id]/route.ts`
```typescript
- GET: Fetch cover letter
- PUT: Update cover letter
- DELETE: Delete cover letter
- PATCH: Update specific fields
```

---

### Phase 6: Context & Hooks

#### 6.1 Chat Context
**File:** `lib/contexts/cover-letter-chat-context.tsx`
```typescript
- Similar to resume chat context
- Manage cover letter ID
- Handle updates
- Provide chat instance
```

#### 6.2 Editor Hook
**File:** `lib/hooks/use-cover-letter-editor.ts`
```typescript
- Manage editor state
- Handle auto-save
- Track changes
- Template switching
- AI integration
```

---

## Technical Specifications

### AI Agent Configuration
```typescript
const coverLetterAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: getCoverLetterPrompt(),
  tools: coverLetterTools,
  stopWhen: stepCountIs(15),
  callOptionsSchema: z.object({
    jobId: z.string().uuid(),
    resumeId: z.string(),
    template: z.enum(['professional', 'creative', 'concise', 'technical']),
    tone: z.enum(['formal', 'casual', 'enthusiastic']).optional(),
  }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nTemplate: ${options.template}`,
  }),
});
```

### Workflow Pattern: Evaluator-Optimizer
```typescript
1. Generate initial cover letter
2. Evaluate quality (tone, structure, keywords)
3. If score < threshold, regenerate with feedback
4. Repeat up to 3 times
5. Return best version
```

### PDF Export Structure
```typescript
- Header: Name, contact info
- Date and recipient (if available)
- Opening paragraph
- Body paragraphs (1-2)
- Closing paragraph
- Signature
- Professional formatting with proper spacing
```

---

## Database Schema (Supabase)

### Existing Table: `cover_letters`
```sql
-- Already exists, no changes needed
id: uuid
user_id: uuid (FK to auth.users)
job_id: uuid (FK to jobs)
resume_id: text
content: text
template: text
created_at: timestamp
```

### Optional Enhancement: `cover_letter_versions`
```sql
-- For version history (optional MVP feature)
id: uuid
cover_letter_id: uuid (FK)
content: text
version: integer
created_at: timestamp
```

---

## Implementation Priority

### MVP (Must Have)
1. ✅ Enhanced cover letter model
2. ✅ Storage layer (client + server)
3. ✅ Upgraded ToolLoopAgent
4. ✅ Basic editor component
5. ✅ AI chat integration
6. ✅ Edit page with split view
7. ✅ PDF export
8. ✅ Chat API endpoint

### Post-MVP (Nice to Have)
- Version history
- Collaborative editing
- Advanced templates
- DOCX export
- Email integration
- A/B testing different versions

---

## Key Differences from Resume Editor

| Feature | Resume Editor | Cover Letter Editor |
|---------|--------------|---------------------|
| **Structure** | Multi-section, complex | Single document, linear |
| **Length** | 1-2 pages | 250-400 words |
| **Editing** | Block-based WYSIWYG | Rich text editor |
| **Templates** | Visual layouts | Writing styles |
| **AI Focus** | Content generation | Tone and personalization |
| **Context** | Standalone | Linked to job + resume |

---

## Success Criteria

### Functional Requirements
- ✅ Generate cover letter from job + resume in < 30 seconds
- ✅ Edit cover letter with AI assistance
- ✅ Export to PDF with professional formatting
- ✅ Switch templates without losing content
- ✅ Auto-save every 30 seconds
- ✅ Real-time preview during generation

### Quality Requirements
- ✅ Cover letters score 80+ on tone match
- ✅ Proper structure (opening, body, closing)
- ✅ 250-400 word length
- ✅ No grammatical errors
- ✅ Personalized to job and candidate

### Performance Requirements
- ✅ Page load < 2 seconds
- ✅ AI generation < 30 seconds
- ✅ PDF export < 5 seconds
- ✅ Auto-save < 1 second

---

## Migration Strategy

### Existing Cover Letters
```typescript
// No migration needed - existing schema is compatible
// Just add new features on top
```

### Backward Compatibility
```typescript
// Ensure old cover letters still work
// Add default values for new fields
// Graceful degradation for missing data
```

---

## Testing Strategy

### Unit Tests
- Storage layer CRUD operations
- AI tool execution
- PDF generation
- Template switching

### Integration Tests
- End-to-end cover letter generation
- AI chat workflow
- Export functionality
- Auto-save mechanism

### E2E Tests
- Create new cover letter flow
- Edit existing cover letter
- Generate with AI
- Export to PDF

---

## Timeline Estimate

### Phase 1: Foundation (2-3 hours)
- Models, storage, enhanced agent

### Phase 2: UI Components (3-4 hours)
- Editor, chat, templates, export

### Phase 3: Pages & Routes (2-3 hours)
- Create, edit, view pages

### Phase 4: API & Integration (2-3 hours)
- Endpoints, context, hooks

### Phase 5: Testing & Polish (2-3 hours)
- Bug fixes, optimization, testing

**Total: 11-16 hours for complete MVP**

---

## Next Steps

1. **Review and approve this plan**
2. **Start with Phase 1** (Foundation)
3. **Implement incrementally** (test each phase)
4. **Deploy to staging** for testing
5. **Gather feedback** and iterate
6. **Production deployment**

---

## Notes

- Reuse as much as possible from resume editor
- Follow existing patterns and conventions
- Keep it simple and focused on MVP
- Ensure type safety throughout
- Document as you build
- Test incrementally

---

**Status:** Ready for Implementation
**Last Updated:** 2026-01-17
**Version:** 1.0
