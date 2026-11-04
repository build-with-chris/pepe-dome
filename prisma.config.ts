import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Nur für die CLI (migrate, db pull). Die App verbindet sich über den
    // Treiber-Adapter in src/lib/prisma.ts. Migrationen müssen am Pooler von
    // Supabase vorbei, deshalb hat die direkte Verbindung Vorrang, sofern sie
    // gesetzt ist. Früher stand das als directUrl im Schema.
    url: process.env.DIRECT_DATABASE_URL || env("DATABASE_URL"),
  },
});
