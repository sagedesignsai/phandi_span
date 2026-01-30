import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const errorMessage = [
      'Missing Supabase environment variables for Admin Client.',
      '',
      'Required variables in .env or .env.local:',
      '  - NEXT_PUBLIC_SUPABASE_URL',
      '  - NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
      '',
      'Current values:',
      `  - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}`,
      `  - NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? '✓ Set' : '✗ Missing'}`,
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

  // Create the admin client with service role key which bypasses RLS
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseServiceRoleKey}`
      }
    }
  })
}