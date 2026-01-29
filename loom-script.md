# Loom Video Script - Task Manager Application

**Duration**: 3-5 minutes

---

## Introduction (30 seconds)

"Hi! I'm going to walk you through my Task Manager application, which is a production-ready web app built with Next.js, TypeScript, Tailwind CSS, and Supabase. I'll explain the key technical concepts, especially around authentication, security, and data management."

---

## 1. Supabase Auth Overview (45 seconds)

"Let me start by explaining how Supabase Auth works in this application.

Supabase Auth is built on top of PostgreSQL and provides JWT-based authentication. Here's the flow:

1. When a user signs up, Supabase creates a record in the `auth.users` table
2. Upon successful authentication, Supabase issues a JWT token
3. This token is stored in HTTP-only cookies for security
4. Every request includes this token, which Supabase validates

In my code, I use two different Supabase clients:
- A browser client for client components (like login forms)
- A server client for server components and server actions (like fetching tasks)

The middleware automatically refreshes the session on every request, ensuring users stay logged in even after page refreshes."

---

## 2. User ID and Task Linking (45 seconds)

"Now, let's talk about how tasks are linked to users.

Every task in the database has a `user_id` column that references the authenticated user. Here's how it works:

1. When a user creates a task, my server action calls `supabase.auth.getUser()` to get the current user
2. The task is inserted with `user_id` set to `user.id`
3. When fetching tasks, I query with `.eq('user_id', user.id)` to only get that user's tasks

This happens entirely server-side in Next.js Server Actions, which means the client never has direct access to the database. All operations go through authenticated server functions that verify the user's identity before performing any database operations."

---

## 3. Row Level Security (RLS) Explanation (60 seconds)

"The most important security feature in this app is Row Level Security, or RLS.

RLS is a PostgreSQL feature that enforces access control at the database level, not just in application code. This is crucial because it means even if there's a bug in my code, users still can't access each other's data.

Here's how it works:

1. I've enabled RLS on the tasks table
2. I've created four policies - one for each operation: INSERT, SELECT, UPDATE, and DELETE
3. Each policy checks that `auth.uid()` equals the `user_id` of the task

For example, the SELECT policy says: 'Only return rows where the user_id matches the currently authenticated user's ID.'

This means:
- User A creates tasks with their user_id
- User B tries to query all tasks
- The database automatically filters and only returns User B's tasks
- User B literally cannot see User A's data, even with direct database access

This is defense in depth - security at the database layer, not just the application layer."

---

## 4. Filtering and Sorting Implementation (45 seconds)

"Let me explain how filtering and sorting work.

I implemented these features server-side using Supabase query builder, not client-side JavaScript. Here's why:

When a user selects a filter or sort option, it updates the URL query parameters. The dashboard page is a Server Component that reads these parameters and builds a Supabase query:

```typescript
let query = supabase.from('tasks').select('*').eq('user_id', user.id);

if (filter !== 'all') {
  query = query.eq('status', filter);
}

query = query.order('due_date', { ascending: sortOrder === 'asc' });
```

This approach:
- Leverages database indexes for performance
- Scales to thousands of tasks
- Reduces data transfer (only filtered results are sent to the client)
- Makes the URL shareable

The database does the heavy lifting, not the browser."

---

## 5. Real Bug and Solution (45 seconds)

"Now let me share a real bug I encountered and how I fixed it.

**The Bug**: After implementing authentication, I noticed that when users refreshed the page, their session would sometimes be null, causing them to be logged out unexpectedly.

**The Root Cause**: I was only using the browser Supabase client, which doesn't properly handle server-side rendering. When Next.js pre-rendered pages on the server, there were no cookies available, so the session appeared null.

**The Solution**: I implemented Supabase's SSR helpers:
1. Created a server-side Supabase client that properly reads cookies using Next.js's `cookies()` API
2. Added middleware that refreshes the session on every request
3. Used the server client in Server Components and Server Actions

This ensures the session is always available, both on the server during SSR and on the client after hydration. The middleware also automatically refreshes tokens, keeping users logged in seamlessly."

---

## Conclusion (30 seconds)

"To summarize:
- Supabase Auth handles authentication with JWT tokens stored in secure cookies
- Tasks are linked to users via user_id, enforced both in application code and at the database level
- Row Level Security provides bulletproof data isolation
- Filtering and sorting happen server-side for optimal performance
- Proper SSR handling ensures sessions persist across page refreshes

This architecture is production-ready, secure, and scalable. Thank you for watching!"

---

## Demo Flow (Optional - if showing the app)

1. Show signup → automatic login → redirect to dashboard
2. Create a few tasks with different statuses and due dates
3. Demonstrate filtering by status
4. Demonstrate sorting by due date
5. Edit a task inline
6. Delete a task
7. Refresh the page → show session persists
8. Log out → show redirect to login
9. Try to access /dashboard while logged out → show redirect to login
10. Log back in → show redirect to dashboard
