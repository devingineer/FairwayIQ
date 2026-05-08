# FairwayIQ

AI-powered golf practice coach. Logs your range sessions, tracks progress, and tells you exactly what to work on next.

## Features

- Practice session logging (clubs, balls hit, duration, notes)
- Streak tracking and weekly goals
- Community feed
- AI coaching chat powered by Gemini — analyses your session history and gives personalised advice
- Google OAuth authentication

## Tech Stack

- **Frontend** — React + Vite, deployed on Vercel
- **Backend** — Supabase (auth, database, edge functions)
- **AI** — Google Gemini 2.5 Flash via Supabase Edge Function

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (for the AI coach)

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/devingineer/SwingPilot.git
   cd SwingPilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

## Supabase Setup

### Database

Create a `sessions` table in your Supabase project:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  duration integer not null,
  balls integer not null,
  clubs text[],
  notes text,
  created_at timestamptz default now()
);

alter table sessions enable row level security;

create policy "Users can manage their own sessions"
  on sessions for all
  using (auth.uid() = user_id);
```

### Edge Functions

Deploy the AI chat function:

```bash
npx supabase functions deploy chat --project-ref your-project-ref
```

Set the Gemini API key as a secret:

```bash
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key --project-ref your-project-ref
```

### Authentication

Enable **Google** as an OAuth provider in your Supabase dashboard under Authentication → Providers. Set the redirect URL to `https://your-domain.com/dashboard`.

## Deployment

The frontend deploys automatically to Vercel on push to `main` via the Vercel GitHub integration.

Edge functions deploy automatically via GitHub Actions when any file under `supabase/functions/` changes on `main`. Add these secrets to your GitHub repo (**Settings → Secrets and variables → Actions**):

| Secret | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_ACCESS_TOKEN` | From supabase.com → Account → Access Tokens |
| `SUPABASE_PROJECT_REF` | Your Supabase project ref |
