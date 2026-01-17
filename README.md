This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm/yarn/bun
- A Supabase account ([sign up here](https://supabase.com))

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

2. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or select an existing one
   - Go to Project Settings → API
   - Copy your Project URL and `anon` `public` key

3. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

   **Note:** The publishable key is the same as the `anon` `public` key found in your Supabase dashboard under Project Settings → API.

### Running the Development Server

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Supabase Setup

1. **Enable Email Authentication:**
   - Go to Authentication → Providers in Supabase Dashboard
   - Enable Email provider
   - Configure email templates if needed

2. **Enable OAuth Providers (Optional):**
   - Go to Authentication → Providers
   - Enable Google, GitHub, or other providers
   - Configure OAuth credentials

3. **Database Schema:**
   - The app uses Supabase for authentication and database storage
   - Tables will be created automatically or you can set them up manually
   - See the database schema documentation for table structures

### Authentication

The app uses Supabase Authentication with support for:
- Email/Password authentication
- OAuth providers (Google, GitHub, etc.)
- Session management with Next.js middleware

For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
