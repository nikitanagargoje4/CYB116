import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadGA, trackPageView } from './utils/gtag.ts';
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  autocapture: true,
  // Enable debug mode in development
  debug: import.meta.env.DEV,
});

// ✅ Load Google Analytics when the app starts
loadGA();

// ✅ Track initial page load in both GA and PostHog
trackPageView(window.location.pathname);
posthog.capture('page_view', { path: window.location.pathname });

createRoot(document.getElementById("root")!).render(<App />);
