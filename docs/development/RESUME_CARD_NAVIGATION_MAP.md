# Resume Card - Navigation Routes

## Updated Navigation Map

### Resume Card UI Layout
```
┌─────────────────────────────────────────────┐
│  Resume Preview  │  Resume Title    [⋮]     │
│  (1/3 width)     │  ─────────────────────   │
│                  │  3 sections • John Doe   │
│                  │  Last edited 2 days ago  │
│                  │                          │
│                  │  [View] [Edit]           │
└─────────────────────────────────────────────┘
        ↓ Card Click         ↓ View           ↓ Edit
  /resumes/[id]/details  /resumes/[id]/details  /resumes/[id]/edit
        ✨                    ✨
```

### Dropdown Menu
```
┌─────────────────────────┐
│ View Details ──→ /details ✨
│ Edit ──────────→ /edit
│ Find Jobs ─────→ /jobs/matches
│ Duplicate
│ Delete (destructive)
└─────────────────────────┘
```

## Route Reference

### Details Page ✨ NEW PRIMARY ROUTE
```
Route: /resumes/[id]/details
File: /app/resumes/[id]/details/page.tsx
Purpose: Detailed view with tabs and statistics
Access Points:
  - Card click
  - View button
  - Dropdown "View Details" menu
```

### Edit Page
```
Route: /resumes/[id]/edit
File: /app/resumes/[id]/edit/page.tsx
Purpose: Edit resume with AI assistance
Access Points:
  - Edit button
  - Dropdown "Edit" menu
```

### Main Page (Deprecated)
```
Route: /resumes/[id]
File: /app/resumes/[id]/page.tsx
Purpose: Previously the main view
Status: Can be repurposed or kept as fallback
```

### Jobs Page
```
Route: /resumes/[id]/jobs/matches
File: /app/resumes/[id]/jobs/page.tsx
Purpose: Find job matches for this resume
Access Points:
  - Dropdown "Find Jobs" menu
```

## Component Hierarchy

```
Dashboard Page
    ↓
ResumeGrid Component
    ↓
ResumeCard Component (UPDATED)
    │
    ├─ onClick → handleCardClick() → router.push(details)
    │
    ├─ View Button → Link to /details
    │
    ├─ Edit Button → Link to /edit
    │
    └─ Dropdown Menu
         ├─ View Details → Link to /details ✨
         ├─ Edit → Link to /edit
         ├─ Find Jobs → Link to /jobs/matches
         ├─ Duplicate → onDuplicate callback
         └─ Delete → onDelete callback
```

## State Propagation Prevention

### Event Flow
```
User clicks card
    ↓
handleCardClick() fires
    ↓
router.push(/details)
```

### Event Flow with Buttons
```
User clicks button within card
    ↓
onClick={(e) => e.stopPropagation()} fires
    ↓
Prevents card click handler
    ↓
Only button navigation happens
```

## Navigation Statistics

### Access Routes to Details Page
| Access Point | Icon | Action |
|--------------|------|--------|
| Card click | - | Direct navigation |
| View button | Outline | Navigation |
| Dropdown menu | Eye | Navigation |

### Total Navigation Points
- **Details Page**: 3 access points
- **Edit Page**: 2 access points
- **Jobs Page**: 1 access point
- **Other**: Duplicate, Delete actions

## User Journey Examples

### New User Journey
```
Dashboard
    ↓
Sees Resume Card
    ↓
Clicks card (intuitive) ← MOST COMMON
    ↓
Lands on Details Page ✨
    ↓
Can Edit, View Jobs, Delete, etc.
```

### Power User Journey
```
Dashboard
    ↓
Resume Card
    ↓
Clicks dropdown menu ⋮
    ↓
Chooses action (View Details, Edit, Find Jobs)
    ↓
Navigates to desired page
```

### Quick Edit Journey
```
Dashboard
    ↓
Resume Card
    ↓
Clicks "Edit" button (direct path)
    ↓
Lands on Edit Page
```

## Code Changes Summary

### Before
```
Card was view-only
Click behavior: None
Main route: /resumes/[id]
```

### After
```
Card is interactive
Click behavior: Navigate to /details
Primary route: /resumes/[id]/details
All buttons: Navigate to /details or /edit
```

## Performance Considerations

✅ No additional API calls
✅ Client-side navigation only
✅ No state changes
✅ Smooth transitions
✅ Event propagation properly managed

## Mobile Responsiveness

✅ Cursor pointer visible on touch devices
✅ Buttons remain clickable
✅ Hover effects work on supported devices
✅ Event propagation works correctly

## Accessibility

✅ Links use proper semantic HTML
✅ Keyboard navigation supported
✅ Screen readers can identify links
✅ Drop-down menu keyboard accessible
✅ Click handlers have visual feedback

## Future Enhancements

- [ ] Add keyboard shortcuts (e.g., D for details, E for edit)
- [ ] Add resume preview modal on hover
- [ ] Add quick favorite/star button
- [ ] Add tag management in card
- [ ] Add sharing options
