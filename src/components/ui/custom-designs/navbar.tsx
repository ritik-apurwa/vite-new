import { Menu, X } from "lucide-react";
import { FaMagnet } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../button";
import { ModeToggle } from "./modetoggle";
import { RiCodepenLine } from "react-icons/ri";

interface NavLinks {
  id: number;
  label: string;
  path: string;
  icon: typeof FaMagnet;
}

const navLinks: NavLinks[] = [
  { id: 1, label: "Home", path: "/", icon: FaMagnet },
  { id: 2, label: "About", path: "/about", icon: FaMagnet },
  { id: 3, label: "Snippets", path: "/snippets", icon: FaMagnet },
  { id: 4, label: "Blog", path: "/blogs", icon: FaMagnet },
  { id: 5, label: "Contact", path: "/contact", icon: FaMagnet },
];

const NavigationCard = ({ icon: Icon, label, path }: NavLinks) => {
  return (
    <Link
      to={path}
      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </Link>
  );
};

const MobileNav = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleRoute = (path: string) => {
    setIsOpen(!isOpen);
    navigate(path);
  };

  return (
    <section className="flex flex-col items-end">
      <section>
        <Button variant="outline" size="icon" asChild onClick={toggleMenu}>
          {isOpen ? <X className="p-2" /> : <Menu className="p-2" />}
        </Button>
      </section>

      {isOpen && (
        <div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                onClick={() => handleRoute(item.path)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <Icon className="text-lg" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const Navbar = () => {
  return (
    <nav className="w-full shadow-md">
      <div className="container mx-auto max-w-7xl flex items-start justify-between py-4 px-6">
        <Link to="/" className="flex items-center space-x-4 ">
          <div className="p-0.5  h-full flex items-center border justify-center">
            <RiCodepenLine size={24} color="indigo" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            TeamHope
          </h1>
        </Link>

        <div className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <NavigationCard key={link.id} {...link} />
          ))}
        </div>
        <div className="hidden lg:flex items-center space-x-6">
          <ModeToggle />
        </div>
        <div className="lg:hidden w-full">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
