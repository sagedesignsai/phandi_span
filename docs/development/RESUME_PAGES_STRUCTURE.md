# Resume Pages Structure Summary

## Current Directory Structure

```
app/resumes/
├── new/
│   └── page.tsx                    # Create new resume
├── [id]/
│   ├── page.tsx                    # Main resume view (existing)
│   ├── details/                    # NEW DIRECTORY
│   │   └── page.tsx                # Details page (NEW) ✨
│   ├── edit/
│   │   └── page.tsx                # Edit resume
│   └── jobs/
│       └── page.tsx                # Resume-related jobs
```

## Resume Pages Overview

### 1. `/resumes/new` - Create Resume
**Purpose**: Build a new resume with AI assistance  
**Features**:
- 2-column layout: Chat on left, preview on right
- Real-time resume building with AI chat
- Auto-save functionality
- "Finish & View Resume" button to complete

**Key Components**:
- `ResumeChat` - AI-powered conversation
- `ResumeViewer` - Live preview
- `ResizablePanelGroup` - Adjustable layout

---

### 2. `/resumes/[id]` - Main Resume View
**Purpose**: View completed resume with basic actions  
**Features**:
- Full resume display
- Template selector
- Export options
- Quick edit/delete buttons
- Last edited date display

**Key Components**:
- `ResumeViewer` - Resume display
- `ExportButton` - Download functionality
- `TemplateSelector` - Change template
- `AlertDialog` - Delete confirmation

**User Actions**:
- Back to dashboard
- Change template
- Export resume
- Edit resume
- Delete resume

---

### 3. `/resumes/[id]/details` - Details & Analytics View (NEW) ✨
**Purpose**: Deep inspection of resume content with statistics  
**Features**:
- **Preview Tab**: Full resume rendering
- **Details Tab**: 
  - Personal information with contact links
  - Experience timeline
  - Education history
  - Skills with levels
  - Projects with links
- **Stats Tab**:
  - Content counts
  - Resume metadata
  - Section completion overview

**Key Components**:
- `Tabs` - Multi-view interface
- `Card` - Organized sections
- `Badge` - Status indicators
- `ScrollArea` - Long content handling
- Icons - Visual hierarchy

**User Actions**:
- Switch between tabs
- Access external links (portfolio, GitHub, LinkedIn)
- View statistics
- Same main actions as main page

---

### 4. `/resumes/[id]/edit` - Edit Resume
**Purpose**: Modify resume with AI or manual editing  
**Features**:
- 2-column layout: AI chat on left, editor/preview on right
- Toggle between editor and preview mode
- Auto-save with status indicators
- Keyboard shortcuts (Cmd/Ctrl + S, E, P)
- Template and export options
- Unsaved changes indicator

**Key Components**:
- `WysiwygEditor` - Visual resume editor
- `ResumeChat` - AI enhancement
- `ResumeViewer` - Preview
- `ToggleGroup` - View mode selection
- Status badges - Save state

**User Actions**:
- Edit manually or with AI
- Save changes
- Toggle view modes
- Change template
- Export
- View full resume

---

## Data Flow

```
Dashboard
    ↓
Resume List (stored in localStorage)
    ↓
┌─────────────────────────────────────┐
│      /resumes/[id] Main Page        │
│  (View-only, Quick actions)         │
└─────────────────────────────────────┘
    ↓                              ↓
    │                              │
    ├──→ /details (NEW)           │
    │    - Deep inspection         │
    │    - Statistics              │
    │    - Detailed breakdown      │
    │                              │
    └──→ /edit                     │
         - Modify content          │
         - Chat with AI            │
         - Switch templates        │
         └─────────────────────────┘
                    ↓
              Save changes
```

## Component Reusability

| Component | Used In |
|-----------|---------|
| `ResumeViewer` | new, main, details, edit |
| `ExportButton` | main, details, edit |
| `TemplateSelector` | main, details, edit |
| `ResumeChat` | new, edit |
| `WysiwygEditor` | edit |
| `AppSidebar` | All pages |
| `SiteHeader` | All pages |

## Data Model Integration

All pages interact with the `Resume` model:

```typescript
Resume {
  id: string
  title: string
  personalInfo: {
    name, email, phone, location, website, linkedin, github, portfolio
  }
  sections: [
    { type: 'experience', items: Experience[] },
    { type: 'education', items: Education[] },
    { type: 'skills', items: Skill[] },
    { type: 'projects', items: Project[] }
  ]
  template: string
  metadata: {
    createdAt, updatedAt, lastEdited, version
  }
}
```

## Storage

All resumes are stored via `@/lib/storage/resume-store`:
- `getResume(id)` - Retrieve specific resume
- `saveResume(resume)` - Save/update resume
- `deleteResume(id)` - Remove resume
- Likely using localStorage for persistence

## Summary

| Page | Focus | Layout | Use Case |
|------|-------|--------|----------|
| **New** | Creation | 2-column chat+preview | Building new resume |
| **Main** | Viewing | Single view + actions | Quick review |
| **Details** ✨ | Analysis | Tabbed + cards | Deep inspection |
| **Edit** | Modification | 2-column editor+chat | Updating resume |

The new **Details page** complements the existing pages by providing a structured, information-rich view that emphasizes detailed content breakdown and statistics rather than quick viewing or editing.
