import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Link from 'next/link'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#0A0A0A' }}>
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Admin Login</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Melde dich an, um auf das Admin-Dashboard zuzugreifen.
            </p>
          </div>

          {/* Clerk SignIn */}
          <SignIn
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#016dca",
                colorBackground: "transparent",
                colorInputBackground: "#0F0F0F",
                colorInputText: "#FFFFFF",
                colorTextOnPrimaryBackground: "#000000",
                colorTextSecondary: "#9CA3AF",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full flex justify-center",
                card: "!bg-transparent shadow-none p-0 border-none w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all duration-200 py-3",
                socialButtonsBlockButtonText: "text-white font-medium",
                socialButtonsProviderIcon: "brightness-0 invert",
                dividerLine: "bg-white/10",
                dividerText: "text-gray-500 text-sm py-4",
                formFieldRow: "mb-5",
                formFieldLabel: "text-gray-300 font-medium mb-2 text-sm",
                formFieldInput: "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#016dca] focus:ring-[#016dca]/20 transition-all duration-200 py-3 px-4 text-base",
                formButtonPrimary: "bg-gradient-to-r from-[#016dca] to-[#B8956A] hover:from-[#0180e8] hover:to-[#016dca] text-black font-semibold transition-all duration-200 shadow-lg shadow-[#016dca]/25 py-3 mt-2",
                footerActionLink: "text-[#016dca] hover:text-[#0180e8] font-medium",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-[#016dca] hover:text-[#0180e8]",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                otpCodeFieldInput: "bg-white/5 border-white/10 text-white",
                footer: "hidden",
                formFieldAction: "text-[#016dca] hover:text-[#0180e8]",
                alert: "bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-4",
                alertText: "text-red-300",
              },
            }}
            routing="path"
            path="/admin/sign-in"
            signUpUrl="/admin/sign-up"
            forceRedirectUrl="/admin"
          />

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
              &larr; Zuruck zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
