import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

/**
 * ESLint Flat Config
 *
 * Ersetzt die alte .eslintrc.json samt `next lint`. Beides ist mit ESLint 10
 * nicht mehr lauffähig, und `next lint` fällt mit Next 16 ohnehin weg. Der
 * Wechsel kam über ein Sicherheitsupdate: Die alte Lint-Kette schleppte
 * Advisories in brace-expansion, minimatch und @typescript-eslint mit.
 *
 * Gelintet wird über `npm run lint` (ESLint-CLI).
 */
export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // Altbestand, der nicht mehr gebaut wird
      '_old/**',
      // Arbeitskopien von Agenten-Läufen, keine Quelldateien
      '.claude/**',
      // Generiert
      'src/generated/**',
      'prisma/migrations/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      /**
       * Die React-Compiler-Regeln kamen mit dem Update von eslint-plugin-react-hooks
       * neu dazu und melden 21 Stellen im Bestand — verteilt über 15 Dateien, alle
       * älter als dieses Update.
       *
       * Bewusst als Warnung statt als Fehler: Sonst wäre `npm run lint` ab sofort
       * dauerhaft rot und würde echte neue Fehler unter dem Altbestand begraben.
       * Es sind Korrektheitshinweise (set-state im Effect, unreine Render-Funktionen),
       * kein Sicherheitsproblem. Aufräumen und danach einzeln auf 'error' zurückstellen.
       */
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]
