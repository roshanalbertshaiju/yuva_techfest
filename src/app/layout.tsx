import type { Metadata } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import './globals.css'

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
  title: 'Yuva Tech-Fest Hackathon | SRM IST Tiruchirappalli',
  description:
    'Join the most electrifying hackathon at SRM Institute of Science and Technology, Tiruchirappalli. Build, innovate, and compete in the Yuva Tech-Fest Hackathon.',
  keywords: ['hackathon', 'SRM IST', 'Tiruchirappalli', 'Yuva Tech-Fest', 'tech fest', 'coding competition'],
  openGraph: {
    title: 'Yuva Tech-Fest Hackathon | SRM IST Tiruchirappalli',
    description: 'The most electrifying hackathon at SRM IST Trichy — Yuva Tech-Fest Hackathon.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#020408] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
