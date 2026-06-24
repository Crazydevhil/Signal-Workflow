# Database Schema & Authentication Architecture

This document maps out the backend infrastructure hosted on Supabase and Google Cloud.

## Database Tables (PostgreSQL)

### 1. `resources` (The Core Asset)
Stores the actual workflow submissions.
*   `id`: UUID (Primary Key)
*   `created_at`: Timestamp
*   `user_id`: UUID (Foreign Key -> `profiles.id`)
*   `title`, `url`, `claim`, `description`, `impressive_numbers`: Text
*   `category`: Text (Used for filtering)
*   `upvotes_count`: Integer (Denormalized cache for fast sorting)
*   `is_approved`: Boolean (Default: FALSE. The moderation gate).

### 2. `profiles` (The Identity Layer)
Stores public-facing user data derived from their Google Account.
*   `id`: UUID (Primary Key, matches `auth.users.id`)
*   `full_name`: Text
*   `avatar_url`: Text
*   `created_at`: Timestamp

### 3. `upvotes` (The Engagement Metric)
A junction table tracking who voted for what.
*   `id`: UUID (Primary Key)
*   `resource_id`: UUID (Foreign Key -> `resources.id`)
*   `user_id`: UUID (Foreign Key -> `auth.users.id`)
*   *Constraint:* `UNIQUE(resource_id, user_id)` prevents double-voting.

### 4. `bookmarks` (The Private Library)
A junction table tracking saved workflows.
*   `id`: UUID
*   `resource_id`: UUID
*   `user_id`: UUID
*   *Constraint:* `UNIQUE(resource_id, user_id)` prevents duplicate bookmarks.

---

## Row Level Security (RLS) Policies
RLS acts as a cryptographic firewall at the database level, preventing hackers from bypassing the frontend to manipulate data.

*   **Resources:** Anyone can SELECT (read) approved workflows. Only the Admin can DELETE or UPDATE workflows. Authenticated users can INSERT new ones.
*   **Upvotes:** Users can only INSERT or DELETE upvotes if their `user_id` matches the authenticated session token.
*   **Bookmarks:** Users can only SELECT, INSERT, or DELETE their own bookmarks. They cannot see what other users have bookmarked.
*   **Profiles:** Publicly readable by anyone. Users can only UPDATE their own profile.

---

## Automated Triggers
To prevent manual profile creation, a PostgreSQL function and trigger were deployed:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```
When a user authenticates via Google for the first time, Supabase creates a row in the secure `auth.users` schema. This trigger immediately fires, extracting their Google `full_name` and `avatar_url` to automatically spawn a public portfolio row in the `profiles` table.

---

## Authentication Configuration
We bypassed standard Email/Password to reduce friction and increase B2B conversion rates, utilizing Google OAuth 2.0.

1.  **Google Cloud Console:** 
    *   An OAuth Client was created.
    *   **Authorized JavaScript origins:** Contains the live Vercel URL.
    *   **Authorized redirect URIs:** Contains the Supabase Auth Callback URL.
2.  **Supabase Auth:** 
    *   Google Provider is enabled.
    *   The Google Client ID and Client Secret are stored securely in the Supabase Dashboard.
