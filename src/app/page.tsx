import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Yuva Tech-Fest 2026 | SRM IST Tiruchirappalli',
  description:
    'Join the most electrifying technology festival at SRM Institute of Science and Technology, Tiruchirappalli. Build, innovate, and compete in the Yuva Tech-Fest.',
  keywords: ['techfest', 'SRM IST', 'Tiruchirappalli', 'Yuva Tech-Fest', 'tech fest', 'coding competition', 'hackathon'],
  openGraph: {
    title: 'Yuva Tech-Fest 2026 | SRM IST Tiruchirappalli',
    description: 'The most electrifying technology festival at SRM IST Trichy — Yuva Tech-Fest.',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 800,
        height: 800,
        alt: 'Yuva Tech-Fest Logo',
      }
    ],
  },
  twitter: {
    card: 'summary',
    images: ['/favicon.png'],
  },
}

export default function Page() {
  return <HomeClient />
}
