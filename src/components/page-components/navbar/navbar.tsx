import { Menu, X } from "lucide-react";
import { FaCodeCommit } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { IconType } from "react-icons";
import { MdHomeMax } from "react-icons/md";
import { TbLogicNand } from "react-icons/tb";
import { PiContactlessPaymentBold } from "react-icons/pi";
import { Logo } from "@/assets/icons";

interface NavLinks {
  id: number;
  label: string;
  path: string;
  icon: IconType;
}

const navLinks: NavLinks[] = [
  { id: 1, label: "Home", path: "/", icon: MdHomeMax },
  { id: 3, label: "Snippets", path: "/snippets", icon: FaCodeCommit },
  { id: 4, label: "Blog", path: "/blogs", icon: TbLogicNand },
  { id: 5, label: "Contact", path: "/contact", icon: PiContactlessPaymentBold },
];

const NavigationCard = ({ icon: Icon, label, path }: NavLinks) => {
  return (
    <Link
      to={path}
      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
    >
      <Icon className="text-lg text-indigo-600" />
      <span>{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleRoute = (path: string) => {
    setIsOpen(!isOpen);
    navigate(path);
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <nav className="w-full flex flex-col shadow-md">
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-4 px-6">
        <Link
          to="/"
          className="flex prose prose-h1:text-2xl dark:prose-invert items-center space-x-2"
        >
        
            <Logo />
       
          <h1>EasySnips</h1>
        </Link>

        <div className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <NavigationCard key={link.id} {...link} />
          ))}
        </div>
        <div className="hidden lg:flex items-center space-x-6">
          <ModeToggle />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          asChild
          onClick={toggleMenu}
        >
          {isOpen ? <X className="p-2" /> : <Menu className="p-2" />}
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="grid grid-cols-2 gap-3 py-5 px-3 sm:grid-cols-3 ">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleRoute(item.path)}
                    className="flex flex-col border-2  p-3"
                  >
                    <Icon className="text-lg w-full flex justify-center" />
                    <h1 className="hover:font-semibold text-gray-600 hover:text-gray-900 text-center">
                      {item.label}
                    </h1>
                  </div>
                );
              })}
            </div>
            <div className="w-full p-3">
              <ModeToggle />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
