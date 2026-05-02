import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import '@/styles/globals.css'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AfyaSignal - Health Triage System',
  description: 'Community health triage and referral system for Sub-Saharan Africa',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/apple-icon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${plusJakarta.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
