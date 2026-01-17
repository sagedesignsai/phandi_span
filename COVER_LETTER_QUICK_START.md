# Cover Letter System - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Navigate to Create Page
```
Go to: /dashboard/cover-letters/new
```

### 2. Fill in Details
- **Select Resume** (required) - Choose from your existing resumes
- **Job Title** (optional) - e.g., "Software Engineer"
- **Company Name** (optional) - e.g., "Acme Corp"
- **Recipient Name** (optional) - e.g., "John Smith"
- **Template** - Choose: Professional, Creative, Concise, or Technical

### 3. Generate or Write
- **Generate with AI** - Let AI create personalized content
- **Start from Scratch** - Write it yourself

### 4. Edit & Improve
- Use the **AI chat** to ask for improvements
- **Auto-saves** every 3 seconds
- **Word counter** shows optimal length (250-400 words)

### 5. Export
- Click **Export** → **PDF** or **TXT**
- Professional formatting ready to send

---

## 💬 AI Chat Examples

### Ask for Generation
```
"Generate a cover letter for this software engineer position at Acme Corp"
```

### Ask for Improvements
```
"Make the opening more enthusiastic"
"Add more technical details"
"Make it more concise"
"Improve the closing paragraph"
```

### Ask for Analysis
```
"Does this match the job tone?"
"Is the length appropriate?"
"Check the structure"
```

---

## 🎨 Templates Guide

### Professional (Default)
**Best for:** Corporate roles, traditional industries
**Tone:** Formal, traditional
**Length:** 3-4 paragraphs
**Example:** Banking, consulting, legal

### Creative
**Best for:** Creative industries, startups
**Tone:** Engaging, storytelling
**Length:** 3-4 paragraphs
**Example:** Design, marketing, media

### Concise
**Best for:** Busy recruiters, tech companies
**Tone:** Brief, direct
**Length:** 2-3 paragraphs
**Example:** Startups, tech, fast-paced environments

### Technical
**Best for:** Technical roles, engineering
**Tone:** Technical, detailed
**Length:** 3-4 paragraphs
**Example:** Software engineering, data science, DevOps

---

## ⌨️ Keyboard Shortcuts

- **Cmd/Ctrl + S** - Save
- **Escape** - Go back
- **Cmd/Ctrl + E** - Focus editor (future)
- **Cmd/Ctrl + P** - Preview (future)

---

## 📁 File Locations

### Pages
```
/dashboard/cover-letters/new          - Create new
/dashboard/cover-letters/[id]         - View
/dashboard/cover-letters/[id]/edit    - Edit
```

### Components
```
components/cover-letter/editor.tsx           - Editor
components/cover-letter/viewer.tsx           - Viewer
components/cover-letter/template-selector.tsx - Templates
components/cover-letter/export-button.tsx    - Export
components/chat/cover-letter-chat.tsx        - AI Chat
```

### Storage
```
lib/storage/cover-letter-store.ts            - Client storage
lib/storage/cover-letter-store-server.ts     - Server storage
```

### AI
```
lib/ai/cover-letter-agent.ts                 - AI Agent
lib/ai/cover-letter-tools.ts                 - AI Tools
lib/ai/cover-letter-prompts.ts               - Prompts
```

---

## 🔧 Troubleshooting

### Cover letter not saving
- Check browser console for errors
- Ensure localStorage is enabled
- Try refreshing the page

### AI not responding
- Check API key is set: `GOOGLE_GENERATIVE_AI_API_KEY`
- Check network tab for errors
- Try regenerating the response

### Export not working
- Check browser allows downloads
- Try different format (PDF vs TXT)
- Check console for errors

### Template not changing
- Click save after changing template
- Refresh if needed
- Content is preserved when switching

---

## 📊 Best Practices

### Writing Tips
1. **Be specific** - Reference actual job requirements
2. **Show enthusiasm** - Express genuine interest
3. **Quantify** - Use numbers and metrics
4. **Be concise** - 250-400 words is optimal
5. **Proofread** - Check for errors before exporting

### Using AI Effectively
1. **Provide context** - More details = better results
2. **Iterate** - Ask for improvements multiple times
3. **Be specific** - "Make opening more enthusiastic" vs "improve this"
4. **Review output** - AI is a tool, you're the expert
5. **Personalize** - Add your own touch

### Template Selection
1. **Match industry** - Professional for corporate, Creative for startups
2. **Match company culture** - Formal vs casual
3. **Match role** - Technical for engineering, Creative for design
4. **When in doubt** - Use Professional (safest choice)

---

## 🎯 Common Workflows

### Workflow 1: Quick Generation
```
1. Create new cover letter
2. Select resume
3. Enter job title and company
4. Click "Generate with AI"
5. Review and export
Time: 2-3 minutes
```

### Workflow 2: Detailed Customization
```
1. Create new cover letter
2. Select resume and enter all details
3. Click "Generate with AI"
4. Use AI chat to refine:
   - "Make opening stronger"
   - "Add more technical details"
   - "Improve closing"
5. Manual edits if needed
6. Export to PDF
Time: 10-15 minutes
```

### Workflow 3: From Scratch
```
1. Create new cover letter
2. Select resume
3. Click "Start from Scratch"
4. Write content manually
5. Use AI chat for suggestions
6. Export when done
Time: 20-30 minutes
```

---

## 📈 Quality Checklist

Before exporting, ensure:
- [ ] **Length** - 250-400 words (check counter)
- [ ] **Structure** - Opening, body, closing
- [ ] **Personalization** - Mentions company and role
- [ ] **Tone** - Matches job posting
- [ ] **Errors** - No typos or grammar mistakes
- [ ] **Contact info** - Correct in resume
- [ ] **Formatting** - Looks professional in preview

---

## 🆘 Need Help?

### In-App Help
- Use the **AI chat** - Ask questions directly
- Check **word counter** - Shows if length is optimal
- Review **template descriptions** - Understand each style

### Documentation
- `IMPLEMENTATION_COMPLETE.md` - Full feature list
- `COVER_LETTER_IMPLEMENTATION_PLAN.md` - Technical details
- Component files - JSDoc comments explain functionality

### Common Questions

**Q: How long should my cover letter be?**
A: 250-400 words is optimal. The word counter shows if you're in range.

**Q: Which template should I use?**
A: Professional is safest. Creative for creative roles, Technical for tech roles.

**Q: Can I change templates after writing?**
A: Yes! Content is preserved when switching templates.

**Q: How do I link to a job posting?**
A: Enter job details when creating. Full job integration coming soon.

**Q: Can I edit after exporting?**
A: Yes! Edit anytime and re-export. Previous exports aren't affected.

---

## 🎉 Success Tips

### For Best Results
1. **Use AI as a starting point** - Then personalize
2. **Iterate** - Ask AI for improvements multiple times
3. **Be specific** - Provide job description details
4. **Match tone** - Formal for corporate, casual for startups
5. **Proofread** - Always review before sending

### Time-Saving Tips
1. **Save templates** - Create variations for different roles
2. **Reuse structure** - Copy good openings/closings
3. **Use AI chat** - Faster than manual editing
4. **Auto-save** - Never lose work
5. **Export early** - Review PDF format before finalizing

---

## 🚀 Ready to Start?

1. Go to `/dashboard/cover-letters/new`
2. Select a resume
3. Enter job details
4. Click "Generate with AI"
5. Review, edit, export!

**You're ready to create professional cover letters in minutes!**
