import Navbar from "@/components/page-components/navbar/navbar";
import { Route } from "react-router-dom";
import Snippets from "./snippets/snippets";
import Blogs from "./blogs/blogs";
import Home from "./home/home";
import ContactPage from "./contact/contact";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PasskeyModal } from "@/components/providers/passkey-modal"; // Ensure this path is correct
import Admin from "./admin/admin";
import { Toaster } from "@/components/ui/toaster";
import { Routes } from "react-router-dom";
import Footer from "@/components/page-components/footer/footer";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section>
        <Navbar />
        <section className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/snippets" element={<Snippets />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </section>
        {/* Render PasskeyModal at the top level */}
        <PasskeyModal />
        <Toaster />
        <Footer/>
      </section>
    </ThemeProvider>
  );
}

export default App;
