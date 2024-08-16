import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"


export default defineConfig({
  esbuild:{
    legalComments:"none", 
  }, 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@convex": path.resolve(__dirname, "./convex")
    },
  },
})