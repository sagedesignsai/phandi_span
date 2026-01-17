# Resume Details Page - Quick Reference

## File Location
```
/app/resumes/[id]/details/page.tsx
```

## Route
```
/resumes/[id]/details
```

## Features at a Glance

### 📋 Preview Tab
- Full resume rendering
- Scrollable view
- Uses `ResumeViewer` component

### 📊 Details Tab - Personal Information
| Field | Display |
|-------|---------|
| Full Name | Text |
| Email | Clickable mailto link |
| Phone | Clickable tel link |
| Location | With map icon |
| Website | Clickable link with globe icon |
| LinkedIn | Link with LinkedIn icon |
| GitHub | Link with GitHub icon |

### 📊 Details Tab - Experience
- Position title (large, bold)
- Company name (small, muted)
- Location (with map pin icon)
- Date range with "Present" indicator
- Description (paragraph)
- Achievements (bullet list)
- Count badge: "Experience (n)"

### 📊 Details Tab - Education
- Degree name (large, bold)
- Institution name (small, muted)
- Field of study
- Location (with map pin icon)
- Date range
- GPA (if available)
- Honors/awards (bullet list)
- Count badge: "Education (n)"

### 📊 Details Tab - Skills
- Skills displayed as badges with variants
- Level indicator (beginner/intermediate/advanced/expert)
- Flexible tag cloud layout
- Count badge: "Skills (n)"

### 📊 Details Tab - Projects
- Project name (large, bold)
- Description (paragraph)
- Technologies (badge tags)
- Project date range
- Quick links:
  - 🌐 View Project (web link)
  - 🐙 Source Code (GitHub link)
- Count badge: "Projects (n)"

### 📈 Stats Tab - Summary Cards
```
┌─────────────┬─────────────┬─────────────┬──────────────┐
│ Experience  │ Education   │   Skills    │   Projects   │
│      n      │      n      │      n      │      n       │
└─────────────┴─────────────┴─────────────┴──────────────┘
```

### 📈 Stats Tab - Resume Information
- Resume ID (monospace, copyable)
- Current template
- Created date
- Last updated date

### 📈 Stats Tab - Content Summary
- Personal Information: Complete/Incomplete
- Experience Section: n items
- Education Section: n items
- Skills Section: n items
- Projects Section: n items

## Header Actions
| Action | Icon | Function |
|--------|------|----------|
| Back | ← | Go to dashboard |
| Template | - | Change resume template |
| Export | ↓ | Download resume |
| Edit | ✏️ | Go to edit page |
| Delete | 🗑️ | Delete resume (with confirmation) |

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout for personal info
- Full-width cards
- Stacked badges

### Tablet (768px - 1024px)
- 2-column grid for personal info
- Stack on smaller sections
- Responsive typography

### Desktop (> 1024px)
- 2-column grid for personal info
- 4-column grid for stats cards
- Full layout optimization

## Icons Used

### Contact & Links
- 📧 MailIcon - Email
- 📱 PhoneIcon - Phone
- 📍 MapPinIcon - Location
- 🌐 GlobeIcon - Website
- 💼 LinkedinIcon - LinkedIn
- 🐙 GithubIcon - GitHub

### Section Headers
- 👤 UserIcon - Personal Info
- 💼 BriefcaseIcon - Experience
- 📚 BookOpenIcon - Education
- 💻 CodeIcon - Skills
- 🏆 AwardIcon - Projects/Stats

### Navigation & Actions
- ← ArrowLeftIcon - Back
- ✏️ EditIcon - Edit
- 🗑️ TrashIcon - Delete
- 📄 FileTextIcon - Resume
- 📅 CalendarIcon - Dates

## Keyboard Shortcuts
None specific to this page, but inherited from parent:
- Users can still use browser shortcuts
- No custom keyboard handlers

## Error States

### Loading
- Animated skeleton loaders
- Shows while fetching resume

### Not Found
- Resume icon placeholder
- "Resume not found" heading
- Error description
- "Go to Dashboard" button

## Delete Confirmation
- Modal dialog overlay
- Title: "Delete Resume"
- Confirmation message
- Cancel and Delete buttons
- Delete is destructive red

## Styling Features
- Card-based layouts
- Badge variants: default, outline, secondary, destructive
- Responsive grid system
- Color-coded status indicators
- Icon-text pairs for clarity
- Proper whitespace and typography

## Data Dependencies
Requires `Resume` data with:
- `id` - Resume identifier
- `title` - Resume title
- `personalInfo` - Contact information
- `sections` - Arrays of Experience, Education, Skills, Projects
- `template` - Current template
- `metadata` - Creation/update dates

## Component Props
```typescript
params: Promise<{ id: string }>
```

## Storage Functions Used
- `getResume(id)` - Load resume
- `deleteResume(id)` - Remove resume
- `saveResume(resume)` - Update resume

## Navigation Links Generated
- Back button: `/dashboard`
- Edit button: `/resumes/[id]/edit`
- Contact links: mailto:/tel:/https:
- Project links: From resume data

## Analytics Points
Stats tab shows:
- Total content items
- Completion metrics
- Last update time
- Section utilization

## Performance Considerations
- Lazy loads resume data
- Scroll areas prevent layout shift
- Memoized component functions
- Efficient re-renders
- No external API calls
