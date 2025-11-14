import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet";
import {
  Cloud,
  Database,
  Shield,
  BarChart3,
  RefreshCw,
  Lock,
  GitBranch,
  MonitorCheck,
  Zap,
  ArrowRight,
  Users,
  Globe,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetworkCanvas from "@/components/NetworkCanvas";

// Import images
import cloudArchitecture from "@/assets/global-network.jpg";
import cloudMigration from "@/assets/technology-sector.jpg";
import hybridCloud from "@/assets/managed-infrastructure.jpg";
import cloudInfrastructureHero from "@/assets/cloud-infrastructure-hero.jpg";
import cloudSecurityShield from "@/assets/cloud-security-shield.jpg";
import cloudMonitoringDashboard from "@/assets/cloud-monitoring-dashboard.jpg";
import devopsAutomationPipeline from "@/assets/devops-automation-pipeline.jpg";
import cloudBackupRecovery from "@/assets/cloud-backup-recovery.jpg";
import cloudGlobalScaling from "@/assets/cloud-global-scaling.jpg";
import wordcloudImage from "../../public/lovable-uploads/wordcloud.png";
import { Link } from "react-router-dom";

const CloudSolutions = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [servicesRef, servicesInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [benefitsRef, benefitsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const cloudServices = [
    {
      icon: Cloud,
      title: "Cloud Architecture & Deployment",
      description:
        "Design and implementation of scalable, secure cloud environments across AWS, Azure, and Google Cloud platforms.",
      features: [
        "Multi-cloud strategy",
        "Scalable architecture",
        "Cost optimization",
        "Security by design",
      ],
      category: "foundation",
      image: cloudArchitecture,
    },
    {
      icon: Database,
      title: "Cloud Migration",
      description:
        "Seamless migration of applications, servers, and databases from on-premise to cloud with minimal downtime.",
      features: [
        "Zero-downtime migration",
        "Data integrity",
        "Performance optimization",
        "Rollback planning",
      ],
      category: "foundation",
      image: cloudMigration,
    },
    {
      icon: GitBranch,
      title: "Hybrid & Multi-Cloud Solutions",
      description:
        "Integration of public, private, and hybrid cloud strategies for flexibility, resilience, and vendor independence.",
      features: [
        "Vendor neutrality",
        "Workload optimization",
        "Unified management",
        "Cost efficiency",
      ],
      category: "foundation",
      image: hybridCloud,
    },
    {
      icon: MonitorCheck,
      title: "Managed Cloud Services",
      description:
        "24/7 monitoring, patching, and support for your cloud infrastructure with proactive maintenance and optimization.",
      features: [
        "24/7 monitoring",
        "Automated patching",
        "Performance tuning",
        "Incident response",
      ],
      category: "operations",
      image: cloudMonitoringDashboard,
    },
    {
      icon: Shield,
      title: "Cloud Security",
      description:
        "Comprehensive security implementation including firewalls, encryption, identity management, and compliance controls.",
      features: [
        "Zero-trust architecture",
        "Compliance frameworks",
        "Threat detection",
        "Identity management",
      ],
      category: "operations",
      image: cloudSecurityShield,
    },
    {
      icon: Zap,
      title: "Auto-Scaling & High Availability",
      description:
        "Ensure maximum uptime and optimal performance under dynamic workloads with intelligent auto-scaling solutions.",
      features: [
        "Intelligent scaling",
        "Load balancing",
        "Fault tolerance",
        "99.99% uptime SLA",
      ],
      category: "operations",
      image: cloudGlobalScaling,
    },
    {
      icon: RefreshCw,
      title: "Backup & Disaster Recovery",
      description:
        "Automated cloud backups with fast, secure recovery options and comprehensive business continuity planning.",
      features: [
        "Automated backups",
        "Point-in-time recovery",
        "Geo-redundancy",
        "RTO < 4 hours",
      ],
      category: "optimization",
      image: cloudBackupRecovery,
    },
    {
      icon: BarChart3,
      title: "DevOps & Automation",
      description:
        "CI/CD pipelines, infrastructure as code (IaC), and automated environment provisioning for faster deployment.",
      features: [
        "CI/CD pipelines",
        "Infrastructure as Code",
        "Automated testing",
        "Container orchestration",
      ],
      category: "optimization",
      image: devopsAutomationPipeline,
    },
    {
      icon: MonitorCheck,
      title: "Cloud Health Monitoring",
      description:
        "Continuous performance, security, and usage monitoring with intelligent alerts and actionable insights.",
      features: [
        "Real-time monitoring",
        "Predictive analytics",
        "Custom dashboards",
        "Automated alerts",
      ],
      category: "optimization",
      image: cloudMonitoringDashboard,
    },
  ];

  const categories = [
    {
      id: "foundation",
      name: "Cloud Foundation",
      description: "Build and migrate to the cloud",
    },
    {
      id: "operations",
      name: "Cloud Operations",
      description: "Manage and secure your cloud",
    },
    {
      id: "optimization",
      name: "Cloud Optimization",
      description: "Optimize and automate",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "99.9% Uptime Guarantee",
      description:
        "Enterprise-grade reliability with comprehensive SLA coverage",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Multi-layered security with compliance certifications",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 support from certified cloud architects",
    },
    {
      icon: Globe,
      title: "Global Scalability",
      description: "Scale your infrastructure worldwide with ease",
    },
  ];

  const stats = [
    { number: "500+", label: "Cloud Migrations Completed", icon: Cloud },
    { number: "99.9%", label: "Uptime Achievement", icon: TrendingUp },
    { number: "24/7", label: "Expert Support", icon: Users },
    { number: "50+", label: "Enterprise Clients", icon: Award },
  ];

  const filteredServices = cloudServices.filter(
    (service) =>
      activeService === 0 ||
      service.category === categories[activeService - 1]?.id,
  );

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Cybaem Tech | Cloud Architecture, Migration & Multi-Cloud</title>
        <meta
          name="description"
          content="Cloud architecture, multi-cloud, zero-downtime migration, DevOps/IaC, zero-trust security, auto-scaling, managed cloud, DR (RTO under 4h), and 24/7 monitoring."
        />
        <link
          rel="canonical"
          href="https://www.cybaemtech.com/cloud-solutions"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Cloud Architecture and Deployment, Multi-cloud Strategy, Scalable Architecture, Cost Optimization, Security by Design, Cloud Migration, Zero-downtime Migration, Data Integrity, Performance Optimization, Rollback Planning, Hybrid and Multi-Cloud Solutions, Vendor Neutrality, Workload Optimization, Unified Management, Cost Efficiency, Managed Cloud Services, 24/7 Monitoring, Automated Patching, Performance Tuning, Incident Response, Cloud Security, Zero-trust Architecture, Compliance Frameworks, Threat Detection, Identity Management, Auto-Scaling and High Availability, Intelligent Scaling, Load Balancing, Fault Tolerance, 99.99% Uptime SLA, Backup and Disaster Recovery, Automated Backups, Point-in-time Recovery, Geo-redundancy, RTO under 4 hours, DevOps and Automation, CI/CD Pipelines, Infrastructure as Code, Automated Testing, Container Orchestration, Cloud Health Monitoring, Real-time Monitoring, Predictive Analytics, Custom Dashboards, Automated Alerts"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Cybaem Tech | Cloud Architecture, Migration & Multi-Cloud"
        />
        <meta
          property="og:description"
          content="End-to-end cloud: architecture & deployment, hybrid/multi-cloud, zero-downtime migration, DevOps/IaC, zero-trust security, HA/auto-scaling, DR (RTO under 4h) & 24/7 ops."
        />
        <meta
          property="og:url"
          content="https://www.cybaemtech.com/cloud-solutions"
        />
        <meta property="og:site_name" content="Cybaem Tech" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Cybaem Tech | Cloud Architecture, Migration & Multi-Cloud"
        />
        <meta
          name="twitter:description"
          content="Cloud architecture, multi-cloud, zero-downtime migration, DevOps/IaC, zero-trust, HA/auto-scaling, DR (RTO under 4h) & 24/7 monitoring."
        />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      >
        {/* Animated Network Canvas Background */}
        <NetworkCanvas />

        <div className="relative z-10 text-center px-8 max-w-7xl -mt-16">
          <div
            className={`transition-all duration-1000 ${heroInView ? "animate-fade-in" : "opacity-0 translate-y-20"}`}
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2.5 px-8 py-3.5 mb-8 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-400/40 rounded-full text-cyan-300 text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300">
              <Cloud className="w-4 h-4" />
              <span className="tracking-wide">
                CLOUD SOLUTIONS & INFRASTRUCTURE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[1.1] mb-8 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Your
              <br />
              Cloud Journey
            </h1>

            {/* Subtitle */}
            <p className="text-[clamp(0.9rem,1.6vw,1.1rem)] leading-[1.6] text-slate-300 max-w-4xl mx-auto mb-12 font-light">
              Accelerate innovation with enterprise-grade cloud solutions. From
              migration to optimization, we deliver scalable, secure, and
              cost-effective cloud infrastructure that grows with your business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="group px-10 py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-[0_10px_30px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Start Your Cloud Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a
                href="https://wa.me/919028541383?text=Hi%20CybaemTech%2C%20I%20want%20to%20connect%20with%20cloud%20experts"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-6 text-lg font-semibold rounded-xl bg-white/5 text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Connect with Cloud Experts
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={servicesRef}
        className="py-24 bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${servicesInView ? "animate-fade-in" : "opacity-0 translate-y-20"}`}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Cloud Services
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Comprehensive cloud solutions covering every aspect of your
              digital transformation journey
            </p>
          </div>

          {/* <div className="flex justify-center mb-12 relative">
  {/* White cloud glow 
  <img 
    src={wordcloudImage} 
    alt="Cloud Glow" 
    className="absolute w-full max-w-4xl blur-xl opacity-60"
  />

  {/* Main word cloud 
  <img 
    src={wordcloudImage} 
    alt="Cloud Word Cloud" 
    className="relative w-full max-w-4xl"
  />
</div> */}

          {/* Service Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant={activeService === 0 ? "default" : "outline"}
              className={`px-6 py-3 transition-all duration-300 motion-safe:hover:scale-105 ${
                activeService === 0
                  ? ""
                  : "border-white/20 text-white bg-transparent hover:bg-white/10"
              }`}
              onClick={() => setActiveService(0)}
            >
              All Services
            </Button>
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={activeService === index + 1 ? "default" : "outline"}
                className={`px-6 py-3 transition-all duration-300 motion-safe:hover:scale-105 ${
                  activeService === index + 1
                    ? ""
                    : "border-white/20 text-white bg-transparent hover:bg-white/10"
                }`}
                onClick={() => setActiveService(index + 1)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <Card
                key={service.title}
                className={`group cursor-pointer transform transition-all duration-500 motion-safe:hover:scale-105 hover:shadow-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md relative overflow-hidden min-h-[420px] ${
                  servicesInView
                    ? "animate-fade-in-up"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 h-full relative z-10">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <service.icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-white">
                    {service.title}
                  </h3>

                  <p className="text-white/80 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm text-white/70"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-6 border border-white/20 bg-white/[0.02] text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/30 transition-colors"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={benefitsRef}
        className="py-24 bg-black relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${benefitsInView ? "animate-fade-in" : "opacity-0 translate-y-20"}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose Our Cloud Solutions?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the benefits of enterprise-grade cloud infrastructure
              with our proven expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`text-center group transition-all duration-500 hover-lift ${
                  benefitsInView
                    ? "animate-slide-up"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 border border-primary/20">
                  <benefit.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors text-white">
                  {benefit.title}
                </h3>
                <p className="text-white/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-24 bg-black relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center group transition-all duration-500 hover-lift ${
                  statsInView ? "animate-slide-up" : "opacity-0 translate-y-20"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 border border-primary/20">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 counter-animation">
                  {stat.number}
                </div>
                <div className="text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Infrastructure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Get a free cloud readiness assessment and discover how we can
            accelerate your digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg bg-white text-primary hover:bg-white/90 transform motion-safe:hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Clock className="mr-2 w-5 h-5" />
                Schedule Free Consultation
              </Button>
            </Link>
            <a
              href="https://cybaemtech.com/Managed-IT-Infrastructure-CyberSecurity-and-Cloud-Services.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-white text-white bg-transparent hover:bg-white/10 focus-visible:ring-white/30 transform motion-safe:hover:scale-105 transition-all duration-300"
              >
                Download Cloud Guide
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CloudSolutions;
