import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">
          Pepe Dome Admin
        </h1>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[var(--color-gold)] hover:bg-[var(--color-gold-light)]',
              card: 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)]',
            }
          }}
          fallbackRedirectUrl="/admin"
        />
      </div>
    </div>
  )
}
