import { type Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-gray": colors.slate,
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
