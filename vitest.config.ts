import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Test-Dateien, die eine echte Datenbank brauchen (Prisma-Schreibzugriffe).
// Ohne DB scheitern sie am Mock, deshalb laufen sie nur im DB-Modus.
// Einstieg über `npm run test:db` mit einer Wegwerf-Test-DB (siehe tests/README.md).
const DB_DEPENDENT_TESTS = [
  'tests/integration/**',
  'tests/models/**',
  'tests/api/**',
  'tests/resend/**',
  'tests/lib/subscribers.test.ts',
  'tests/lib/newsletters.test.ts',
]

// INCLUDE_DB_TESTS=1 (via `npm run test:db`) nimmt die DB-Tests dazu.
const includeDbTests = process.env.INCLUDE_DB_TESTS === '1'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // .claude/worktrees enthält vollständige Repo-Kopien. Ohne diesen
    // Ausschluss läuft jede Testdatei mehrfach, und Treffer aus alten
    // Worktrees sehen aus wie Fehler im aktuellen Stand.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '.claude/**',
      '.next/**',
      ...(includeDbTests ? [] : DB_DEPENDENT_TESTS),
    ],
    // Run tests sequentially to avoid database conflicts
    pool: 'forks',
    // Disable parallel file execution
    fileParallelism: false,
    // Run tests within a file sequentially
    sequence: {
      concurrent: false,
    },
    // Increase timeout for database operations
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './tests/__mocks__/server-only.ts'),
    },
  },
})
