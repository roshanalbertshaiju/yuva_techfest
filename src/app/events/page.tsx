import type { Metadata } from 'next'
import EventsClient from './EventsClient'

export const metadata: Metadata = {
  title: 'Events & Schedule | Yuva Tech-Fest 2025',
  description:
    'Explore the tech-fest challenge tracks, event schedule timeline, and the exciting cash prizes and perks at Yuva Tech-Fest SRM IST Tiruchirappalli.',
  keywords: ['techfest tracks', 'techfest schedule', 'timeline', 'prizes', 'cash prize pool', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Events & Schedule | Yuva Tech-Fest 2025',
    description: 'Explore challenge tracks, schedule timeline, and cash prizes at Yuva Tech-Fest Trichy.',
    type: 'website',
  },
}

export default function EventsPage() {
  return <EventsClient />
}
