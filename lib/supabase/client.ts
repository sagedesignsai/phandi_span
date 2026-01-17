import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Support both PUBLISHABLE_KEY and ANON_KEY for backwards compatibility
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const errorMessage = [
      'Missing Supabase environment variables.',
      '',
      'Required variables in .env or .env.local:',
      '  - NEXT_PUBLIC_SUPABASE_URL',
      '  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)',
      '',
      'Current values:',
      `  - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}`,
      `  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing'}`,
      `  - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}`,
      '',
      'Get these from: https://supabase.com/dashboard/project/_/settings/api',
      '',
      '⚠️ Make sure:',
      '  1. .env or .env.local file exists in the project root',
      '  2. Variable names are correct (no typos)',
      '  3. Dev server has been restarted after adding/modifying variables',
      '  4. No quotes around values in .env file',
      '  5. No spaces around the = sign',
      '',
      '💡 Tip: NEXT_PUBLIC_ variables are embedded at build time.',
      '   You MUST restart the dev server (stop and start) after adding them.',
    ].join('\n')

    throw new Error(errorMessage)
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

