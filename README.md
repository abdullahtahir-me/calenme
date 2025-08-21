# Calenme - The All-in-One Student Planner

Calenme is a full-stack web application designed to help university students organize their academic lives. From managing courses and tracking assignments to viewing daily schedules, Calenme provides a clean, centralized hub for all your academic needs.

This project was built from the ground up to demonstrate a modern, robust, and scalable web architecture using industry-standard technologies.

**Live Application:** [**https://calenme.vercel.app**](https://calenme.vercel.app/)

---

## Features

-   **Secure Authentication:** Users can sign up and log in using their email and password or via Google OAuth for quick access.
-   **Dynamic Dashboard:** An at-a-glance overview of today's classes, upcoming assignments, and key academic stats.
-   **Course Management:** Full CRUD (Create, Read, Update, Delete) functionality for courses, including details like course code, instructor, and color-coding.
-   **Class Scheduling:** Add multiple class sessions (lectures, labs) for each course with specific days, times, and locations.
-   **Assignment Tracking:** Keep track of all your assignments, their due dates, and mark them as complete.
-   **User Profiles:** A dedicated section for users to manage their personal information and preferences.


---

## Technical Stack

This project was built with a modern, type-safe, and server-centric approach.

### Frontend
-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **State Management:** React Hooks (`useState`, `useEffect`)

### Backend & Database
-   **Backend-as-a-Service:** [Supabase](https://supabase.io/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **Authentication:** Supabase Auth (including JWT management and RLS policies)
-   **Database Logic:** Custom PostgreSQL Functions (SQL) for transactional operations.

### Deployment
-   **Platform:** [Vercel](https://vercel.com/)

---

## Key Technical Challenges & Solutions

Building Calenme involved solving several interesting technical problems:

1.  **Server-Side Authentication with OAuth:**
    -   **Challenge:** Implementing a secure Google OAuth flow that works with Next.js server-side components.
    -   **Solution:** Created a dedicated API route to initiate the OAuth flow on the server, which then securely exchanges the auth code for a session in a separate callback route. This avoids exposing client secrets and prevents common CORS issues.

2.  **Transactional Data Integrity:**
    -   **Challenge:** When a user creates a course and its multiple class schedules at the same time, the operation must be "all-or-nothing" to prevent orphaned data.
    -   **Solution:** Wrote a custom PostgreSQL function (`create_course_with_schedule`) that wraps all `INSERT` statements in a single, atomic transaction. The Next.js API calls this function via RPC, ensuring data consistency.

3.  **Secure, User-Specific Data Fetching:**
    -   **Challenge:** Ensuring that a user can *only* ever see or modify their own data.
    -   **Solution:** Implemented security at multiple layers:
        -   **API Layer:** All database queries in the API routes are strictly filtered with `.eq('user_id', user.id)`.
        -   **Database Layer:** PostgreSQL Row-Level Security (RLS) policies are enabled on all user-specific tables (`courses`, `assignments`, etc.) as a final, unbreakable line of defense.

---

## Getting Started Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdullahtahir-me/calenme.git
    cd calenme
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Supabase project:**
    -   Create a new project on [Supabase](https://supabase.io/).
    -   Run the table creation scripts found in the `/sql` directory (or wherever you've saved them).
    -   Set up the database triggers as described in the SQL files.

4.  **Set up environment variables:**
    -   Create a `.env.local` file in the root of the project.
    -   Copy the contents of `.env.example` into it.
    -   Fill in your Supabase Project URL and Anon Key.
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.