import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Awards from "./pages/Awards";
import Careers from "./pages/Careers";
import LifeAtCybaemTech from "./pages/LifeAtCybaemTech";
import Industries from "./pages/Industries";
import ManagedServices from "./pages/ManagedServices";
import NotFound from "./pages/NotFound";
import CloudSolutions from "./pages/CloudSolutions";
import CybersecurityServices from "./pages/CybersecurityServices";
import EnterpriseSolutions from "./pages/EnterpriseSolutions";
import DigitalMarketing from "./pages/DigitalMarketing";
import AIDataAnalytics from "./pages/AIDataAnalytics";
import Contact from "./pages/Contact";
import ITAugmentation from "./pages/ITAugmentation";
import ScrollToTop from "@/components/ScrollToTop";
import BlogPost from "./components/BlogPost";
import ThankYou from "./components/ThankYou";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Resources from "./pages/Resources";

import { AdminAuthProvider } from "./admin/contexts/AdminAuthContext";
import { AdminLogin } from "./admin/pages/AdminLogin";
import { DashboardLayout } from "./admin/layouts/DashboardLayout";
import { Dashboard } from "./admin/pages/Dashboard";
import { ContentList } from "./admin/pages/ContentList";
import { ContentEditor } from "./admin/pages/ContentEditor";
import { MediaLibrary } from "./admin/pages/MediaLibrary";
import { Settings } from "./admin/pages/Settings";
import { Comments } from "./admin/pages/Comments";
import { Gallery } from "./admin/pages/Gallery";
import { JobsList } from "./admin/pages/JobsList";
import { JobEditor } from "./admin/pages/JobEditor";
import { JobApplications } from "./admin/pages/JobApplications";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/awards" element={<Leadership />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/life-at-cybaemtech" element={<LifeAtCybaemTech />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/managed-services" element={<ManagedServices />} />
            <Route path="/cloud-solutions" element={<CloudSolutions />} />
            <Route path="/cybersecurity-services" element={<CybersecurityServices />} />
            <Route path="/enterprise-solutions" element={<EnterpriseSolutions />} />
            <Route path="/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/ai-data-analytics" element={<AIDataAnalytics />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/it-augmentation" element={<ITAugmentation />} />
            <Route path="/blog/:type/:slug" element={<BlogPost />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/:type/:slug" element={<BlogPost />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/thankyou" element={<ThankYou onBack={function (): void {
              throw new Error("Function not implemented.");
            } } />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="content" element={<ContentList />} />
              <Route path="content/new" element={<ContentEditor />} />
              <Route path="content/edit/:id" element={<ContentEditor />} />
              <Route path="jobs" element={<JobsList />} />
              <Route path="jobs/new" element={<JobEditor />} />
              <Route path="jobs/edit/:id" element={<JobEditor />} />
              <Route path="job-applications" element={<JobApplications />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="comments" element={<Comments />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
