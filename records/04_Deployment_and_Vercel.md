# Deployment & Environment Configuration

## The Hosting Pipeline (Vercel + GitHub)
The application utilizes Continuous Integration / Continuous Deployment (CI/CD) via Vercel.

1.  **The Source of Truth:** All code lives in a private GitHub repository (`Crazydevhil/Signal-Workflow`).
2.  **The Trigger:** Whenever a `git push origin main` is executed locally, GitHub sends a webhook to Vercel.
3.  **The Build:** Vercel automatically spins up a cloud server, runs `npm run build`, compiles the Next.js application into optimized static and serverless edge functions, and deploys it globally.

## Environment Variables
The application requires connection keys to speak to the database. These keys must NEVER be hardcoded into the GitHub repository for security reasons.

### Local Environment (`.env.local`)
Used during development (`npm run dev`).
```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```
*Note: The `NEXT_PUBLIC_` prefix is required by Next.js to allow these variables to be exposed securely to Client Components in the browser.*

### Production Environment (Vercel)
The exact same variables are stored in the Vercel Dashboard under **Settings -> Environment Variables**. During the build process, Vercel injects these variables into the compiled code.

## Handling Database Migrations
Because the database (Supabase) and the frontend (Vercel) are decoupled, any future changes to the backend must be managed carefully:
1.  **Frontend Update:** Write the code to utilize the new data.
2.  **Backend Migration:** Run the SQL `ALTER TABLE` commands in the Supabase SQL Editor.
3.  **Deploy:** Push the frontend code to Vercel.
