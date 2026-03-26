/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Enterprise Color Palette
                primary: "#2563eb", // Royal Blue - Trust & Professionalism
                primaryDark: "#1d4ed8",
                secondary: "#64748b", // Slate 500
                background: "#f8fafc", // Very light slate gray (almost white)
                surface: "#ffffff", // Pure white for cards
                textMain: "#0f172a", // Slate 900 for headings
                textSecondary: "#475569", // Slate 600 for body
                border: "#e2e8f0", // Light border
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",

                // Legacy mappings for compatibility (overridden by new logic)
                glass: "white",
                glassBorder: "#e2e8f0",
                darkBg: "#f8fafc", // Mapping darkBg to light bg effectively switching the theme
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
            }
        },
    },
    plugins: [],
}
