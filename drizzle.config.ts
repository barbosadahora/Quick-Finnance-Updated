import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/qfin";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
