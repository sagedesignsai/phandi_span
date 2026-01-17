# Environment Variables Setup Guide

## Quick Fix for "Missing Supabase environment variables" Error

If you're getting an error about missing environment variables, follow these steps:

### 1. Create `.env` or `.env.local` file in the project root

Create a file named `.env` or `.env.local` in the root directory of your project (same level as `package.json`):

**Note:** Next.js supports both `.env` and `.env.local`:
- `.env.local` - Highest priority, loaded in all environments (not committed to git)
- `.env` - Lower priority, but still works

```bash
# In the project root directory
touch .env
# OR
touch .env.local
```

### 2. Add your Supabase credentials

Open your `.env` (or `.env.local`) file and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

**Important notes:**
- No quotes around the values
- No spaces around the `=` sign
- No trailing spaces or newlines after values
- The publishable key is the same as the `anon` `public` key in your Supabase dashboard

### 3. Get your credentials from Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **`anon` `public`** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 4. Restart your development server

**This is crucial!** `NEXT_PUBLIC_` environment variables are embedded at build time and only loaded when the server starts.

```bash
# Stop the current server completely (Ctrl+C)
# Then restart it
pnpm dev
```

**Important:** Just saving the `.env` file is not enough - you MUST stop and restart the server!

### 5. Verify the variables are loaded

You can check if the variables are loaded by temporarily adding this to any page:

```typescript
// Remove after checking!
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Missing ✗')
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'Set ✓' : 'Missing ✗')
```

## Common Issues

### Issue: Variables still not loading after restart

**Solution:** Check:
1. File is named exactly `.env` or `.env.local` (not `.env.txt` or `.env.local.txt`)
2. File is in the project root (same directory as `package.json`)
3. No typos in variable names
4. No quotes around values
5. No spaces around the `=` sign (use `KEY=value`, not `KEY = value`)
6. Try stopping the server completely and restarting
7. Check if `.env.local` exists and overrides `.env` (`.env.local` has higher priority)
8. Clear `.next` cache: `rm -rf .next` then restart

### Issue: Wrong variable names

The code supports both:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (recommended)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (backwards compatible)

Both will work, but use `PUBLISHABLE_KEY` to match the latest Supabase docs.

### Issue: Edge Runtime (Middleware) not seeing variables

If middleware specifically can't see the variables:
1. Make sure variables start with `NEXT_PUBLIC_`
2. Restart the dev server
3. Clear `.next` cache: `rm -rf .next` then restart

## File Structure

Your project structure should look like this:

```
phandi_span/
├── .env               ← Can use this file
├── .env.local         ← OR this file (higher priority)
├── .gitignore         ← Should include .env*
├── package.json
├── next.config.ts
└── ...
```

## Example `.env` or `.env.local` file

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ1Njg4OCwiZXhwIjoxOTUzMDMyODg4fQ.example
```

**Format notes:**
- ✅ `KEY=value` (no spaces)
- ✅ One variable per line
- ❌ `KEY = value` (spaces around =)
- ❌ `KEY="value"` (quotes not needed)
- ❌ Empty lines between variables are OK

**⚠️ Security Note:**
- Never commit `.env.local` to git (it should be in `.gitignore`)
- The `NEXT_PUBLIC_` prefix means these values are exposed to the client (this is safe for Supabase anon keys)
- Never use the `service_role` key in client-side code

