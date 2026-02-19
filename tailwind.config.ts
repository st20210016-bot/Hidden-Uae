import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 30px rgba(45, 212, 191, 0.18), 0 0 80px rgba(251, 146, 60, 0.12)"
      },
      backgroundImage: {
        "night-gradient":
          "radial-gradient(1200px 600px at 10% 10%, rgba(45,212,191,0.18), transparent 60%), radial-gradient(900px 500px at 90% 25%, rgba(251,146,60,0.16), transparent 55%), linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(3,7,18,1) 100%)"
      },
      colors: {
        brandTeal: "#2dd4bf",
        brandOrange: "#fb923c"
      }
    }
  },
  plugins: []
} satisfies Config;
