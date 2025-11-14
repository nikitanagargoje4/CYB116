import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Globe, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MobileNavigation from "./MobileNavigation";

const whatsappLogo =
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResourcesClick = (e: React.MouseEvent) => {
    if (location.pathname === "/resources") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 text-black shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between mobile-padding">
        {/* Logo Section */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center space-x-2 touch-target"
        >
          <img
            src="/lovable-uploads/77cb2418-56bd-44ad-8bfd-3651e3cdb2c0.png"
            alt="CybaemTech Logo"
            className="h-12 md:h-16 w-auto"
          />
        </Link>

        {/* Mobile and Tablet Contact Button and Hamburger Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            asChild
            className="text-xs md:text-sm font-medium bg-primary hover:bg-primary/90 text-white px-3 py-2"
          >
            <Link to="/contact">Contact</Link>
          </Button>
          <button
            className="p-2 rounded focus:outline-none bg-white shadow"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList className="gap-6 xl:gap-8">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black hover:text-primary bg-transparent">
                Our Solutions
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white text-black">
                <div className="grid gap-4 p-6 md:w-[700px] lg:w-[800px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/digital-marketing"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Digital Marketing & Consulting
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Digital strategy, business optimization, and change
                            management
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/cloud-solutions"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Cloud Solutions & Infrastructure
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Cloud migration, multi-cloud management, and
                            infrastructure as code
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/ai-data-analytics"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            AI & Data Analytics
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Artificial intelligence, machine learning, and
                            business intelligence
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="space-y-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/cybersecurity-services"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Cybersecurity Services
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Security assessment, managed services, and
                            compliance management
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/enterprise-solutions"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Enterprise Solutions
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Application development, system integration, and
                            DevOps automation
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/managed-services"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Managed Services
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            24/7 monitoring, support, and disaster recovery
                            solutions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/it-augmentation"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            IT Augmentation
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Scale your tech teams with global talent
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/industries"
                  className="text-black hover:text-primary transition-colors text-sm font-medium"
                >
                  Industries We Serve
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black hover:text-primary bg-transparent">
                About Us
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white text-black">
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium leading-none">
                        About CybaemTech
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/leadership"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium leading-none">
                        Leadership and Partnership
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Meet our team and strategic partners
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black hover:text-primary bg-transparent">
                Careers
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white text-black">
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/careers"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium leading-none">
                        Job Opportunities
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/life-at-cybaemtech"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium leading-none">
                        Life at CybaemTech
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <a
                      href="https://skilltonitedu.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                    >
                      <div className="text-sm font-medium leading-none">
                        Train with CybaemTech
                      </div>
                    </a>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/resources"
                  onClick={handleResourcesClick}
                  className="text-black hover:text-primary transition-colors text-sm font-medium"
                >
                  Resources
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Navigation Items and CTA */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          <Button
            variant="default"
            size="sm"
            asChild
            className="text-sm font-medium touch-target bg-primary hover:bg-primary/90 text-white px-5 py-2 shadow-lg"
          >
            <Link to="/contact">Contact</Link>
          </Button>
          <div className="flex items-center space-x-2 xl:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-black hover:text-black hover:bg-gray-100 touch-target"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span className="text-sm">India</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>
    </header>
  );
};

export default Header;
