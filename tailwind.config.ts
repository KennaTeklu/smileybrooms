import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Professional color palette
        professional: {
          50: "#f8fafc", // Very light gray-blue
          100: "#f1f5f9", // Light gray-blue
          200: "#e2e8f0", // Light gray
          300: "#cbd5e1", // Medium-light gray
          400: "#94a3b8", // Medium gray
          500: "#64748b", // Base gray
          600: "#475569", // Dark gray
          700: "#334155", // Darker gray
          800: "#1e293b", // Very dark gray
          900: "#0f172a", // Almost black
        },
        trust: {
          50: "#f0f9ff", // Very light blue
          100: "#e0f2fe", // Light blue
          200: "#bae6fd", // Light blue
          300: "#7dd3fc", // Medium-light blue
          400: "#38bdf8", // Medium blue
          500: "#0ea5e9", // Base blue (trustworthy)
          600: "#0284c7", // Dark blue
          700: "#0369a1", // Darker blue
          800: "#075985", // Very dark blue
          900: "#0c4a6e", // Almost navy
        },
        success: {
          50: "#f0fdf4", // Very light green
          100: "#dcfce7", // Light green
          200: "#bbf7d0", // Light green
          300: "#86efac", // Medium-light green
          400: "#4ade80", // Medium green
          500: "#22c55e", // Base green
          600: "#16a34a", // Dark green
          700: "#15803d", // Darker green
          800: "#166534", // Very dark green
          900: "#14532d", // Almost dark green
        },
        warning: {
          50: "#fffbeb", // Very light amber
          100: "#fef3c7", // Light amber
          200: "#fde68a", // Light amber
          300: "#fcd34d", // Medium-light amber
          400: "#fbbf24", // Medium amber
          500: "#f59e0b", // Base amber
          600: "#d97706", // Dark amber
          700: "#b45309", // Darker amber
          800: "#92400e", // Very dark amber
          900: "#78350f", // Almost brown
        },
        error: {
          50: "#fef2f2", // Very light red
          100: "#fee2e2", // Light red
          200: "#fecaca", // Light red
          300: "#fca5a5", // Medium-light red
          400: "#f87171", // Medium red
          500: "#ef4444", // Base red
          600: "#dc2626", // Dark red
          700: "#b91c1c", // Darker red
          800: "#991b1b", // Very dark red
          900: "#7f1d1d", // Almost maroon
        },
        // Custom colors for "brooms" highlight
        "brooms-bg-emphasis": "hsl(var(--trust-500))", // Uses trust blue for background
        "brooms-text-emphasis": "hsl(var(--professional-50))", // Uses light text
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        flash: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        flash: "flash 0.2s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
