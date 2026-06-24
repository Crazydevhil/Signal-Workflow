# Signal Workflows: Master Architecture & Logic

## Executive Summary
Signal Workflows is a "proof-of-work" board designed to catalog, verify, and share high-impact AI and automation workflows. It allows professionals to move beyond theoretical AI discussions and share mechanical, deployed systems that generate measurable ROI.

## Core Tech Stack
1.  **Frontend Framework:** Next.js (App Router)
2.  **Styling:** Vanilla CSS (`globals.css`) for maximum performance and bespoke dark-mode "premium" aesthetic.
3.  **Backend & Database:** Supabase (PostgreSQL)
4.  **Authentication:** Supabase Auth via Google Cloud OAuth 2.0
5.  **Hosting & CI/CD:** Vercel (linked directly to GitHub repository)

## Core Business Logic & Features
The platform operates on a decentralized submission model governed by a central admin firewall.

1.  **Authentication & Identity:** 
    *   Users cannot submit, upvote, or save workflows without a verified Google Account.
    *   Upon first login, a Postgres Trigger automatically generates a public profile for them using their Google Display Name and Avatar.
2.  **Workflow Submission (The Intake):** 
    *   Authenticated users can submit a workflow through the `/submit` route. 
    *   Data includes Tool Name, The Claim, Impact Numbers, Category, URL, and a Detailed Description.
3.  **The Governance Firewall (Moderation):** 
    *   All newly submitted workflows default to `is_approved = false` in the database.
    *   They are completely invisible to the public feed until the Admin (you) goes into the Supabase database and flips the boolean to `true`.
4.  **The Public Feed (`/`):** 
    *   The home page acts as the main distribution hub. It is dynamically rendered to instantly fetch the latest approved workflows.
    *   Workflows are ranked by `upvotes_count` in descending order.
    *   Users can filter the feed by specific business categories (e.g., Sales & Leads, Operations & Admin).
5.  **Engagement Engine (Upvoting & Bookmarking):** 
    *   Users can upvote workflows. A user can only upvote a specific workflow once (enforced by a database Unique Constraint).
    *   Users can bookmark workflows to save them to their private `/saved` dashboard.
6.  **Public Portfolios (`/profile/[id]`):** 
    *   Every user has a public portfolio page showcasing all their approved workflow submissions, acting as an immutable "Proof of Work" resume.

## Directory Structure
*   `src/app/` - The Next.js App Router containing all page routes (`page.tsx`, `layout.tsx`).
*   `src/app/auth/` - The authentication trigger page.
*   `src/app/submit/` - The workflow intake form.
*   `src/app/profile/[id]/` - Dynamic routing for user portfolios.
*   `src/app/saved/` - The private dashboard for bookmarked workflows.
*   `src/components/` - Reusable UI elements (`ResourceCard.tsx`, `HeaderAuth.tsx`, `AuthForm.tsx`).
*   `src/lib/` - Utility functions, specifically the `supabase.ts` client initializer.
*   `supabase/` - Contains the raw SQL migration scripts used to build the database architecture.
