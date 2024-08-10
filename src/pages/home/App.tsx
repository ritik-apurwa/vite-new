import TestComponent from "@/components/ui/custom-designs/test";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
import {} from "framer-motion";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section>
        <TestComponent />
      </section>
    </ThemeProvider>
  );
}

export default App;
