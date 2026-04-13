# The Count

The Count is a freeform accountability partner app that helps you stay accountable with AI-powered coaching and tracking.

## Setup

### Prerequisites

- Node.js >= 18
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd the-count
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your project dashboard, go to Settings > API to get your project URL and anon key.
3. Create a new file `.env.local` in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. If your app uses authentication, enable it in Supabase dashboard and configure redirect URLs to `http://localhost:3000/auth/callback`.

### 4. Set up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys) and generate an API key.
2. Add to your `.env.local`:

```env
OPENAI_API_KEY=your-openai-api-key
```

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 6. Deploy to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import your repository.
3. In the Vercel project settings, add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. Deploy.