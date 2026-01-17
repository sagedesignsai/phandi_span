# Supabase Setup Guide

This guide will help you set up Supabase for authentication and database in your Phandi'span application.

## Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Node.js 20+ installed
- pnpm, npm, or yarn installed

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Name: `phandi-span` (or your preferred name)
   - Database Password: Choose a strong password (save it securely)
   - Region: Choose the closest region to your users
4. Click "Create new project" and wait for it to be set up

## Step 2: Get Your API Keys

1. Once your project is created, go to **Project Settings** → **API**
2. You'll need two values:
   - **Project URL**: Found in the "Project URL" section
   - **anon public key**: Found in the "Project API keys" section (use the `anon` `public` key)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

2. Replace the values with your actual Supabase project URL and publishable key
   
   **Note:** The publishable key is the same as the `anon` `public` key found in your Supabase dashboard under Project Settings → API.

## Step 4: Configure Authentication

### Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable the **Email** provider
3. Configure email templates if needed (optional)
4. Set up email confirmation settings:
   - **Disable email confirmations** for easier signup (recommended for development/MVP)
   - Go to Authentication → Providers → Email → Toggle off "Confirm email"
   - See `SUPABASE_EMAIL_CONFIRMATION.md` for detailed instructions
   - Configure redirect URLs

### Enable OAuth Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Enable providers you want to support (e.g., Google, GitHub)
3. For Google:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add your redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. For GitHub:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## Step 5: Set Up Database Schema (Optional)

The application will work with Supabase's built-in `auth.users` table for authentication. For additional data like resumes, you may want to create custom tables:

```sql
-- Example: Create a resumes table
CREATE TABLE public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own resumes
CREATE POLICY "Users can view their own resumes"
  ON public.resumes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes"
  ON public.resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 6: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL(s):
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - `https://your-production-domain.com/auth/callback`

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000`
3. Try signing up with an email address
4. Check your email for the confirmation link (if email confirmation is enabled)

## Troubleshooting

### "Invalid API key" error
- Make sure you're using the `anon` `public` key (also called publishable key), not the `service_role` key
- The publishable key is found in Project Settings → API → `anon` `public` key
- Verify your `.env.local` file has the correct values
- Restart your development server after updating environment variables

### "Email not confirmed" error
- Check your Supabase email settings
- Verify email confirmation is configured correctly
- Check spam folder for confirmation emails

### OAuth not working
- Verify redirect URLs are correctly configured
- Check that OAuth credentials are correct
- Ensure redirect URLs match exactly (including protocol)

### Session not persisting
- Check that middleware is set up correctly
- Verify cookies are being set in your browser
- Check browser console for errors

## Next Steps

- Set up database tables for your application data
- Configure Row Level Security (RLS) policies
- Set up email templates for better UX
- Configure additional OAuth providers
- Set up database backups and monitoring

For more information, check the [Supabase Documentation](https://supabase.com/docs).

