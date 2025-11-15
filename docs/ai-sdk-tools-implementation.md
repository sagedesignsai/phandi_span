# AI SDK Tools Agents Implementation

This document explains the refactored implementation using `@ai-sdk-tools/agents` instead of the experimental Agent class from the AI SDK.

## Why AI SDK Tools Agents?

The `@ai-sdk-tools/agents` package provides a production-ready, feature-rich agent implementation with:

### Key Advantages

1. **Built-in Memory System**
   - Persistent context across conversations
   - Automatic message history management
   - Chat title generation
   - Working memory for agent state

2. **Better Streaming API**
   - `toUIMessageStream()` method for Next.js route handlers
   - Proper event handling and lifecycle management
   - Better integration with AI Elements components

3. **Multi-Agent Orchestration**
   - Handoff capabilities between specialized agents
   - Programmatic routing with pattern matching
   - Automatic agent selection based on context

4. **Production Features**
   - Event system for monitoring and debugging
   - Context-aware instructions
   - Tool permissions and guardrails
   - Better error handling

## Architecture

### Single Agent Mode (Default)

```typescript
const agent = createResumeAgent(resumeId);
```

- Single agent handles all resume operations
- Faster, simpler for most use cases
- Full access to all resume tools

### Multi-Agent Orchestration (Optional)

```typescript
const agents = createResumeAgents();
const orchestrator = agents.orchestrator;
```

Specialized agents:
- **Personal Info Collector** - Focuses on contact details
- **Experience Specialist** - Handles work experience
- **Education Specialist** - Manages education details
- **Skills & Projects Specialist** - Collects skills and projects

The orchestrator routes requests to appropriate specialists based on:
- Pattern matching (`matchOn` arrays)
- LLM-based routing for complex cases

## Memory System

The implementation uses `InMemoryProvider` for development:

```typescript
memory: {
  provider: new InMemoryProvider(),
  workingMemory: {
    enabled: true,
    scope: 'chat', // Chat-level memory
  },
  history: {
    enabled: true,
    limit: 20, // Last 20 messages
  },
  chats: {
    enabled: true,
    generateTitle: true, // Auto-generate titles
  },
}
```

### Memory Scopes

- **`chat`** - Memory scoped to current conversation
- **`user`** - Memory scoped to user across all chats

### Production Memory

For production, use persistent storage providers:
- `DrizzleProvider` - SQL database via Drizzle ORM
- `PrismaProvider` - SQL database via Prisma
- Custom providers for other storage backends

## API Route Changes

### Before (Experimental Agent)

```typescript
const result = streamText({
  model: chatModel,
  messages: convertToModelMessages(messages),
  system: systemPrompt,
  tools: resumeTools,
  maxSteps: 10,
  stopWhen: stepCountIs(10),
});

return result.toUIMessageStreamResponse({
  sendSources: true,
  sendReasoning: true,
});
```

### After (AI SDK Tools Agent)

```typescript
const agent = createResumeAgent(resumeId);

return agent.toUIMessageStream({
  messages,
  context: { resumeId, userId },
  chatId, // For memory persistence
  maxRounds: 1,
  maxSteps: 10,
  onEvent: (event) => {
    // Handle events
  },
});
```

## Event System

The agent emits events for monitoring:

- `agent-start` - Agent begins execution
- `agent-step` - Agent completes a step
- `agent-finish` - Agent finishes a round
- `agent-handoff` - Agent hands off to another
- `agent-complete` - All execution complete
- `agent-error` - Error occurred

Example event handling:

```typescript
onEvent: async (event) => {
  if (event.type === 'agent-handoff') {
    console.log(`Handoff: ${event.from} → ${event.to}`);
  }
}
```

## Context-Aware Instructions

Agents can receive typed context:

```typescript
interface ResumeAgentContext {
  resumeId?: string | null;
  userId?: string;
}

instructions: (context) => {
  if (context?.resumeId) {
    return `Working on resume ${context.resumeId}...`;
  }
  return 'Creating new resume...';
}
```

## Tool Integration

All resume tools work seamlessly with agents:

```typescript
tools: resumeToolsWithArtifacts,
maxTurns: 10, // Max tool call iterations
```

## Usage Examples

### Basic Single Agent

```typescript
// API route
const agent = createResumeAgent(resumeId);
return agent.toUIMessageStream({ messages, context });
```

### Multi-Agent with Handoffs

```typescript
// API route
const agents = createResumeAgents();
return agents.orchestrator.toUIMessageStream({
  messages,
  context,
  maxRounds: 3, // Allow handoffs
});
```

### With Memory Persistence

```typescript
return agent.toUIMessageStream({
  messages,
  context,
  chatId: 'chat-123', // Persists conversation
});
```

## Migration Notes

1. **No breaking changes** - The API route interface remains the same
2. **Enhanced features** - Memory, events, and handoffs are optional
3. **Better performance** - Optimized streaming and context management
4. **Production ready** - Proper error handling and monitoring

## Next Steps

1. **Add persistent memory** - Replace `InMemoryProvider` with database provider
2. **Enable multi-agent** - Toggle `useSpecialists` flag for complex workflows
3. **Add guardrails** - Implement input/output validation
4. **Monitor events** - Set up logging/analytics for agent events

## References

- [AI SDK Tools Agents Documentation](https://ai-sdk-tools.dev/docs/agents)
- [Memory System Documentation](https://ai-sdk-tools.dev/docs/memory)
- [Artifacts Integration](https://ai-sdk-tools.dev/docs/artifacts)

