# Codebase Explanation: Next.js App Router

The frontend is built using Next.js 14 utilizing the App Router architecture. This architecture splits code into **Server Components** (rendered on the server for SEO and speed) and **Client Components** (rendered in the browser for interactivity).

## Server Components

### `src/app/page.tsx` (The Home Feed)
*   **Role:** The primary distribution dashboard.
*   **Logic:** It receives URL search parameters (`/?category=Sales`). It queries the Supabase `resources` table (filtering by `is_approved = true` and `category`). It explicitly requests a JOIN operation with the `profiles` table to pull the author's name and avatar.
*   **Why Server-Side?** By fetching data on the server, the site loads instantly for the user with all data present, which is critical for SEO and perceived speed.

### `src/app/profile/[id]/page.tsx` (The Portfolio)
*   **Role:** Public portfolio generation.
*   **Logic:** Uses dynamic routing (`[id]`). It extracts the user ID from the URL, queries their specific profile data, and fetches all workflows where `user_id` matches the URL parameter.

## Client Components
*Identified by the `"use client"` directive at the top of the file.*

### `src/app/submit/page.tsx` (The Intake Form)
*   **Role:** Handles user input and database insertion.
*   **Logic:** Uses React `useState` to manage the form payload. On mount, it checks if a user is logged in; if not, it redirects them to the Auth page. On submit, it pushes the JSON payload to the `resources` table in Supabase.

### `src/components/ResourceCard.tsx` (The Engine of Engagement)
*   **Role:** The visual container for every workflow.
*   **Logic:** This is the most complex component. Because it handles Upvoting and Bookmarking, it must be a Client Component. 
    *   It maintains local state for `upvotes`, `hasUpvoted`, and `hasBookmarked`.
    *   On load, it silently queries the database to see if the current user has already upvoted or bookmarked this specific card, and updates the UI accordingly (turning the buttons purple).
    *   When clicked, it sends the INSERT or DELETE command to Supabase and optimistically updates the UI numbers without refreshing the page.

### `src/components/HeaderAuth.tsx` (The Dynamic Nav)
*   **Role:** The global navigation bar's brain.
*   **Logic:** It uses an event listener (`supabase.auth.onAuthStateChange`) to constantly monitor if the user is logged in. It dynamically swaps the "Log In" button for "My Profile" and "Log Out" based on the session state.

## The Design System (`globals.css`)
We avoided TailwindCSS to maintain absolute control over the "Premium Dark Mode" aesthetic. 
*   **CSS Variables:** All colors (backgrounds, accents, borders) are stored as root variables for easy global theming.
*   **Glassmorphism:** Achieved using `background: rgba()` combined with `backdrop-filter: blur()`.
*   **Animations:** The background utilizes a subtle, rotating `glow-bg` animation to make the site feel alive and dynamic without sacrificing performance.
