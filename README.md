# TaskFlow - Comprehensive Todo List App

A modern, full-stack todo list application built with Next.js, Supabase, and TypeScript. Features a clean minimal white/gray design with comprehensive task management capabilities.

## Features

### Core Functionality
- **Dual Task Lists**: Separate daily and monthly task organization
- **Task Cards**: Rich task cards with titles, notes, and tags
- **Persistent Checkboxes**: Mark tasks complete without deletion
- **User Authentication**: Secure email/password authentication with Supabase
- **Database Persistence**: All data stored securely in Supabase PostgreSQL

### Advanced Features
- **Recurring Tasks**: Automatic task recreation based on frequency patterns
- **Progress Tracking**: Visual progress bars and completion statistics
- **Analytics Dashboard**: Productivity scoring, achievement levels, and trends
- **Tag System**: Organize tasks with custom tags
- **Mobile Responsive**: Optimized for all device sizes

### Technical Features
- **Row Level Security**: Secure data isolation per user
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Error Handling**: Comprehensive error boundaries and loading states
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Deployment**: Vercel (ready for deployment)

## Getting Started

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd taskflow
   npm install
   \`\`\`

2. **Database Setup**
   - Run the SQL scripts in the scripts/ folder in your Supabase dashboard
   - Or use the built-in script execution in v0

3. **Environment Variables**
   - All Supabase environment variables are pre-configured in v0
   - For local development, add your Supabase credentials to .env.local

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Usage

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Create Tasks**: Add tasks to daily or monthly lists with titles, notes, and tags
3. **Manage Tasks**: Edit, complete, or delete tasks as needed
4. **Recurring Tasks**: Set up tasks that automatically recreate when completed
5. **Track Progress**: Monitor your productivity with built-in analytics

## Database Schema

- **tasks**: Main task storage with user isolation via RLS
- **profiles**: User profile information
- **Automatic triggers**: Profile creation and timestamp updates

## API Endpoints

- /api/recurring-tasks: Process recurring task creation (GET/POST)

## Deployment

The app is ready for deployment on Vercel with:
- Automatic Supabase integration
- Environment variable management
- Edge runtime optimization
- Mobile-responsive design

## Security

- Row Level Security (RLS) policies protect all user data
- Secure authentication with Supabase Auth
- CSRF protection and secure session management
- Input validation and sanitization
