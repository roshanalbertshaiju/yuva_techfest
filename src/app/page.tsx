import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Yuva Tech-Fest Hackathon 2025 | SRM IST Tiruchirappalli',
  description:
    'Join the most electrifying hackathon at SRM Institute of Science and Technology, Tiruchirappalli. Build, innovate, and compete in the Yuva Tech-Fest Hackathon.',
  keywords: ['hackathon', 'SRM IST', 'Tiruchirappalli', 'Yuva Tech-Fest', 'tech fest', 'coding competition'],
  openGraph: {
    title: 'Yuva Tech-Fest Hackathon 2025 | SRM IST Tiruchirappalli',
    description: 'The most electrifying hackathon at SRM IST Trichy — Yuva Tech-Fest Hackathon.',
    type: 'website',
  },
}

export default function Page() {
  return <HomeClient />
}
