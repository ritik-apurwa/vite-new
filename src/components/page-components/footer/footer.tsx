import React from "react";
import { motion } from "framer-motion";
import { frontendSkills, navLinks } from "@/assets/data";
import { Logo } from "@/assets/icons";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaUpwork } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Logo />
            </motion.div>
            <h1 className="text-2xl font-bold mt-2">EasySnips</h1>
          </div>

          <nav className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold mb-2">Navigation</h2>
            {navLinks.map((item) => (
              <motion.div key={item.label} whileHover={{ x: 5 }}>
                <Link
                  to={item.path}
                  className="text-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            {frontendSkills.slice(0, 4).map((item) => (
              <motion.div
                key={item.title}
                className="text-sm"
                whileHover={{ x: 5 }}
              >
                {item.title}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold mb-2">More Skills</h2>
            {frontendSkills.slice(4).map((item) => (
              <motion.div
                key={item.title}
                className="text-sm"
                whileHover={{ x: 5 }}
              >
                {item.title}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Follow Us:</h2>
            <div className="flex gap-4">
              {[
                { Icon: FaTwitter, url: "https://twitter.com" },
                { Icon: FaUpwork, url: "https://www.upwork.com" },
                { Icon: FaLinkedin, url: "https://www.linkedin.com" },
                { Icon: FaInstagram, url: "https://www.instagram.com" },
              ].map(({ Icon, url }) => (
                <motion.a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-foreground transition-colors duration-200"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()} EasySnips. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
