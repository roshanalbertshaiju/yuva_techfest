import type { Metadata } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Yuva Tech-Fest | SRM IST Tiruchirappalli',
  description:
    'Join the most electrifying technology festival at SRM Institute of Science and Technology, Tiruchirappalli. Build, innovate, and compete in the Yuva Tech-Fest.',
  keywords: ['techfest', 'SRM IST', 'Tiruchirappalli', 'Yuva Tech-Fest', 'tech fest', 'coding competition', 'hackathon'],
  openGraph: {
    title: 'Yuva Tech-Fest | SRM IST Tiruchirappalli',
    description: 'The most electrifying technology festival at SRM IST Trichy — Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#020408] text-[#e2e8f0] antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
