# Ticket Project (The Road to Next)

> This is the project which is built during the [The Road to Next Course](https://www.road-to-next.com/) from [Robin Wieruch](https://www.robinwieruch.de/blog/). The goal of the project is to build a full-fledged full-stack application which allows the user to create, update, organize, delete tickets, comment on them, attaching files to them and much more.

## General Information

- One reason for me to take the course / project is to get familiar using React Server Components in Next.js (using the App Router)
- The course dives deeply into Next.js, React 19 and its intricacies by using server actions, route handlers, caching strategies, streaming / Suspense etc.
- Apart from teaching Next.js, the course (and this project) focuses on software architecture (creating a service/data layer, using events in a message queue)
- The project also includes advanced topics like rolling your own authentication, setting up an email service and processing payments using the Stripe API
- The course also includes several challenges where the students have to implement features all on their own without any solutions provided to reinforce the learned material. This was particularly helpful to identify gaps in understanding

## Technologies Used

- React 19
- Next.js 15
- Tailwind CSS 3
- Prisma
- Supabase
- TypeScript
- Zod
- Oslo
- shadcn/ui
- AWS S3
- Inngest
- Resend
- Stripe
- TanStack Query
- nuqs

## Features

- create, edit, delete tickets
- create comments for specific tickets (delete, edit comments)
- upload and attach files (e.g. images) to tickets / comments using AWS S3
- subscribe via Stripe to access additional features (e.g. creating private tickets)
- creating / updating / deleting organizations to organize users into groups (e.g. send invitations via email)
- authentication (signing up/in/out, validating/invalidating sessions using cookies)
- provide immediate UI feedback using toast notifications
- manage permissions for specific users / organizations

## Screenshots

![Example screenshot](https://i.ibb.co/WmLJ9Lw/Screenshot-2025-08-15-191135.png)

## Demo

Live demo [_here_](https://rulolab.com/).

## Setup

### Prerequisites

- To fully run this application with all of its features you would need to setup Supabase, AWS, Resend, Stripe and Upstash
- I'm going to keep it simple by providing a basic setup

The dependencies which are necessary to run this app can be found in the package.json file.

1. Clone the repo
2. Install NPM packages in the project folder by running `npm install` in the terminal (maybe `--force` flag needed). 
3. Add your own `.env` file for connecting to a database *
4. Run the database migration `npx prisma generate` `npx prisma db push` to create the DB tables
5. Seed the database using `npm prisma db seed`
6. Run the app: `npm run dev`
7. Visit localhost:3000 in your browser
8. Use seed data to sign in (`prisma/seed.ts`)

* You need to setup the following `.env` variables to setup the connection to your database

```
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL="..."

# Direct connection to the database. Used for migrations.
DIRECT_URL="..."
```

## Learnings

- reasoning about architectures for full-stack applications with scaling in mind (event queues, service layer, data layer)
- create a feature-specific file/folder structure to quickly find things in a large codebase
- client-based data fetching using TanStack query (including caching)
- setting up pagination (e.g. cursor-based)
- rolling your own authentication (migrating from lucia to oslo)
- providing immediate UI feedback for form actions with toast notifications (using sonner and `useActionState` or cookies)
- using type-safe URL state management (using nuqs)
- implementing file uploads and handling of files (AWS)
- setting up processing of payments and management of subscriptions (Stripe)
- sending emails based on specific events (resend)
- creating and using API endpoints for third-party clients (route handler)

## Project Status

The project is basically finished. There are several suggestions for improving the project (e.g., adding an onboarding flow, audit log, dashboard for reporting or an multi-invite flow) which I may implement in the future.

## Acknowledgements

- This project is a part of the [The Road to Next Course](https://www.road-to-next.com/) from [Robin Wieruch](https://www.robinwieruch.de/blog/).
