# AI Module Organization

## Structure

```
lib/ai/
├── provider.ts                    # Shared AI provider config (Google Gemini)
├── resume/                        # Resume-specific AI features
│   ├── agent.ts                  # Autonomous resume agent
│   ├── tools.ts                  # Resume tools (CRUD, analysis, matching)
│   ├── prompts.ts                # Resume prompts
│   └── chat-context.tsx          # Resume chat context provider
├── cover-letter/                  # Cover letter AI features (future)
│   ├── agent.ts
│   ├── tools.ts
│   └── prompts.ts
└── job-preparation/               # Job prep AI features (future)
    ├── agent.ts
    └── tools.ts

app/api/
├── resume/
│   └── chat/
│       └── route.ts              # Resume chat API endpoint
├── cover-letter/                  # Future: Cover letter endpoints
│   └── chat/
│       └── route.ts
└── job-prep/                      # Future: Job prep endpoints
    └── chat/
        └── route.ts
```

## Usage

### Resume Chat
```typescript
// Import resume-specific context
import { ChatProvider, useSharedChatContext } from '@/lib/ai/resume/chat-context';

// API endpoint: /api/resume/chat
```

### Future: Cover Letter Chat
```typescript
// Import cover letter context
import { ChatProvider } from '@/lib/ai/cover-letter/chat-context';

// API endpoint: /api/cover-letter/chat
```

## Benefits

1. **Separation of Concerns**: Each feature has its own AI logic
2. **Scalability**: Easy to add new AI features
3. **Maintainability**: Clear organization
4. **Reusability**: Shared provider config
5. **Type Safety**: Isolated contexts per feature
