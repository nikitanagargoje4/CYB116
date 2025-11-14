import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X, Phone } from "lucide-react";
const whatsappLogo = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}
const MobileNavigation = ({
  isOpen,
  onToggle
}: MobileNavigationProps) => {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const handleResourcesClick = () => {
    if (location.pathname === "/resources") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onToggle();
  };
  const menuItems = [{
    label: "Our Solutions",
    isCollapsible: true,
    isOpen: solutionsOpen,
    onToggle: () => setSolutionsOpen(!solutionsOpen),
    items: [{
      label: "Digital Marketing & Consulting",
      path: "/digital-marketing"
    }, {
      label: "Cloud Solutions & Infrastructure",
      path: "/cloud-solutions"
    }, {
      label: "AI & Data Analytics",
      path: "/ai-data-analytics"
    }, {
      label: "Cybersecurity Services",
      path: "/cybersecurity-services"
    }, {
      label: "Enterprise Solutions",
      path: "/enterprise-solutions"
    }, {
      label: "Managed Services",
      path: "/managed-services"
    }, {
      label: "IT Augmentation",
      path: "/it-augmentation"
    }]
  }, {
    label: "Industries We Serve",
    isCollapsible: false,
    path: "/industries"
  }, {
    label: "About Us",
    isCollapsible: true,
    isOpen: aboutOpen,
    onToggle: () => setAboutOpen(!aboutOpen),
    items: [{
      label: "About CybaemTech",
      path: "/about"
    }, {
      label: "Leadership & Awards",
      path: "/leadership"
    }]
  }, {
    label: "Careers",
    isCollapsible: true,
    isOpen: careersOpen,
    onToggle: () => setCareersOpen(!careersOpen),
    items: [{
      label: "Job Opportunities",
      path: "/careers"
    }, {
      label: "Life at CybaemTech",
      path: "/life-at-cybaemtech"
    }, {
      label: "Train with CybaemTech",
      path: "https://skilltonitedu.com/",
      external: true
    }]
  }, {
    label: "Resources",
    isCollapsible: false,
    path: "/resources"
  }];
  return <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent side="right" className="w-80 bg-black border-gray-800 p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-bold">
              CybaemTech
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onToggle} className="touch-target text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        
        <nav className="flex flex-col py-2 overflow-y-auto flex-1 mobile-nav-scrollbar">
          {menuItems.map((item, index) => <div key={index} className="mb-1">
              {item.isCollapsible ? <Collapsible open={item.isOpen} onOpenChange={item.onToggle}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-5 py-3 text-left text-white hover:bg-white/10 touch-target">
                      <span className="font-medium">{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0 bg-gray-900/50">
                    {item.items?.map((subItem, subIndex) => <li key={subIndex}>
                        {subItem.external ? <a href={subItem.path} target="_blank" rel="noopener noreferrer" className="block px-7 py-2 text-sm transition-colors touch-target text-gray-300 hover:text-white hover:bg-white/5">
                            {subItem.label}
                          </a> : <Link to={subItem.path} onClick={onToggle} className={`block px-7 py-2 text-sm transition-colors touch-target ${isActive(subItem.path) ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                            {subItem.label}
                          </Link>}
                      </li>)}
                  </CollapsibleContent>
                </Collapsible> : <Link to={item.path!} onClick={item.path === "/resources" ? handleResourcesClick : onToggle} className={`block px-5 py-3 font-medium transition-colors touch-target ${isActive(item.path!) ? 'text-primary bg-primary/10 border-r-2 border-primary' : 'text-white hover:bg-white/10'}`}>
                  {item.label}
                </Link>}
            </div>)}
          
          {/* Mobile-specific contact button only */}
          <div className="px-6 pt-6 border-t border-gray-800 mt-4 flex flex-col gap-3">
            <Link to="/contact?source=mobile-menu" onClick={onToggle}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white touch-target">
                Contact
              </Button>
            </Link>
            {/* Removed Raise a Ticket Button */}
          </div>
        </nav>
      </SheetContent>
    </Sheet>;
};
export default MobileNavigation;