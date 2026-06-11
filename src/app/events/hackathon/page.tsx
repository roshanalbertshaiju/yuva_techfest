import type { Metadata } from 'next'
import HackathonClient from './HackathonClient'

export const metadata: Metadata = {
  title: 'Yuva Hackathon | Flagship Hackathon Details',
  description:
    'Learn about the 36-hour flagship Yuva Hackathon at SRM IST Tiruchirappalli. Check out our challenge tracks, timeline schedule, and championship prize pool.',
  keywords: ['hackathon tracks', 'schedule timeline', 'flagship hackathon', 'championship prizes', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Yuva Hackathon | Flagship Hackathon Details',
    description: 'Explore challenge tracks, schedule timeline, and champion prizes at Yuva Hackathon.',
    type: 'website',
  },
}

export default function HackathonPage() {
  return <HackathonClient />
}
