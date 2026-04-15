import { defineConfig, env } from "prisma/config";
import { config } from "dotenv"; // Import dotenv

// Load .env before defining the config
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  // ... other configurations
  datasource: {
    url: env("DATABASE_URL"),
  },
});
