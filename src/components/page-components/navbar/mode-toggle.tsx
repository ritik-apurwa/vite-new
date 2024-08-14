import { motion } from "framer-motion";
import { useState } from "react";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOn, setIsOn] = useState(theme === "light");

  const toggleTheme = () => {
    const newTheme = isOn ? "dark" : "light";
    setTheme(newTheme);
    setIsOn(!isOn);
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <section className="flex items-center flex-row px-10 border-2 lg:border-none lg:py-0 lg:px-0 py-3 justify-between space-x-4">
      <Button asChild variant="outline" size="icon" className="size-8">
        <Link to="https://github.com/ritik-apurwa">
          <FaGithub />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" className="size-8">
        <Link to="https://www.linkedin.com/in/ritik-kumar-85ba78273/">
          <FaLinkedin />
        </Link>
      </Button>
      <div
        onClick={toggleTheme}
        className={`flex h-8 w-16 items-center rounded-full p-1 shadow-inner hover:cursor-pointer bg-zinc-100 dark:bg-zinc-700 ${isOn ? "justify-end" : "justify-start"}`}
      >
        <motion.div
          className="flex size-6 items-center justify-center rounded-full bg-black/90"
          layout
          transition={spring}
        >
          <motion.div whileTap={{ rotate: 360 }}>
            {isOn ? (
              <RiSunFill className="text-xl text-yellow-300" />
            ) : (
              <RiMoonClearFill className="text-xl text-slate-200" />
            )}
          </motion.div>
        </motion.div>
      </div>
      <Unauthenticated>
        <Button
          asChild
          variant="default"
          size="icon"
          className="w-14 h-8 text-xs"
        >
          <SignInButton />
        </Button>
      </Unauthenticated>

      <Authenticated>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-10 text-xs"
        >
          <UserButton />
        </Button>
      </Authenticated>
    </section>
  );
}
