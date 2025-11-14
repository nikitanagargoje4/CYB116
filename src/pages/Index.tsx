import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import StatsAndCertifications from "@/components/StatsAndCertifications";
import WhoWeAre from "@/components/WhoWeAre";
import InsightCards from "@/components/InsightCards";
import WhyChooseUs from "@/components/WhyChooseUs";
import TransformBusinessCTA from "@/components/TransformBusinessCTA";
import ClientTestimonials from "@/components/ClientTestimonials";
import LatestInsights from "@/components/LatestInsights";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '849578774171204');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=849578774171204&ev=PageView&noscript=1"
          />`}
        </noscript>
      </Helmet>
      <Header />
      <HeroSection />
      <PartnersCarousel />
      <StatsAndCertifications />
      <WhoWeAre />
      <InsightCards title="Services We" highlightedWord="Provide" displayMode="carousel" />
      <WhyChooseUs />
      <TransformBusinessCTA />
      <ClientTestimonials />
      <LatestInsights />
      <ContactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
