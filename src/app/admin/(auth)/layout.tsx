/**
 * Auth Layout - No authentication check
 * Used for sign-in and sign-up pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
