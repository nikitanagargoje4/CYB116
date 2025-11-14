# Cybaem Tech - Corporate Website & Blog Platform

## Overview

Cybaem Tech is a comprehensive corporate website for an IT services and consulting company. The platform showcases the company's services (Managed IT Support, Cloud Solutions, AI & Data Analytics, Cybersecurity, Digital Marketing), features a blog/resources section, career opportunities, and client engagement tools. Built with React, TypeScript, and modern web technologies, it serves both as a marketing platform and a resource hub for clients and prospects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (development server with HMR, production builds)
- **UI Library:** shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens
- **Routing:** React Router v6 for client-side navigation
- **Form Handling:** React Hook Form with Zod validation
- **State Management:** TanStack Query for server state
- **Analytics:** PostHog and Google Analytics integration

**Design Patterns:**
- Component-based architecture with atomic design principles
- Custom hooks for reusable logic (usePostHog, useRouteChangeTracker)
- Responsive-first mobile design with breakpoint-based layouts
- Dark theme with custom CSS variables for brand consistency

**Key Architectural Decisions:**
- Single-page application (SPA) with client-side routing to provide smooth navigation
- Lazy loading and code splitting for optimal performance
- SEO optimization through React Helmet for meta tags and structured data
- Accessibility-first approach using Radix UI's accessible primitives

### Backend Architecture

**Contact Form System:**
- Backend API endpoints (contact-backend.js) using Express.js and Nodemailer
- Email delivery system for contact form submissions
- reCAPTCHA integration for spam protection
- Support for tracking selected plans from marketing pages

**Content Management:**
- Client-side admin dashboard for blog/content management
- localStorage-based data persistence (development/demo mode)
- Media library with base64 image storage
- RESTful API structure for content CRUD operations

**Deployment Configuration:**
- Development: Vite proxy forwarding `/api` to backend
- Production: Backend deployed to `/backend/api` on cPanel
- Environment-based API URL configuration

### Data Storage Solutions

**Current Implementation:**
- **Frontend State:** Component state, React Context, TanStack Query cache
- **Media Storage:** Base64 encoding in localStorage (admin media library)
- **Blog Content:** JSON files and localStorage (development mode)
- **Analytics Data:** PostHog cloud storage

**Database References (for future production):**
- MySQL database configuration present in backend files
- Database credentials for cPanel deployment available
- Schema includes: blog posts, comments, jobs, applications
- Migration files provided for salary/department columns

**Note:** The application currently uses client-side storage for demo purposes. Production deployment requires implementing the MySQL backend with proper authentication and API endpoints.

### Authentication & Authorization

**Current Implementation (Development):**
- Client-side authentication using sessionStorage
- Environment variable-based admin credentials
- Protected routes using ProtectedRoute component

**Security Considerations:**
- System designed for easy migration to server-side auth
- Password hashing (bcrypt) and JWT tokens recommended for production
- CORS configuration present for API security
- reCAPTCHA integration for form protection

### External Dependencies

**Third-Party Services:**
- **PostHog:** Product analytics and event tracking
  - API key: `VITE_POSTHOG_API_KEY`
  - Self-hosted or cloud instance support
  
- **Google Analytics:** Page view tracking and user analytics
  - Tracking ID configuration in gtag utilities
  
- **reCAPTCHA:** Form spam protection
  - Site key: `VITE_RECAPTCHA_SITE_KEY`
  
- **Email Service:** SMTP for contact form notifications
  - Nodemailer with configurable SMTP settings
  - WhatsApp integration for direct messaging

**Social Media Integrations:**
- Facebook, Twitter/X, LinkedIn, Instagram, YouTube, WhatsApp
- Social sharing functionality for blog posts
- Embedded social feeds and follow buttons

**Cloud Infrastructure (Referenced):**
- AWS, Azure, Google Cloud (services offered)
- cPanel hosting for production deployment
- CDN usage for static assets recommended

**UI Component Libraries:**
- Radix UI primitives for accessible components
- Embla Carousel for image carousels
- Tabler Icons and Lucide React for iconography
- Framer Motion potential (not currently implemented)

**Development Tools:**
- ESLint for code quality
- TypeScript for type safety
- PostCSS with Autoprefixer
- Vite plugins for development workflow

**Key Integrations:**
- Google Maps API (contact page location)
- Social login capabilities (infrastructure present)
- Email marketing platform integration points
- Payment gateway ready (for future e-commerce)