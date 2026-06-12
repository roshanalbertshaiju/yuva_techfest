import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us | Yuva Tech-Fest 2025',
  description:
    'Learn about the premier Yuva Tech-Fest hosted by SRM IST Tiruchirappalli, meet the student organizers and team members, and check our FAQ list.',
  keywords: ['about SRM IST', 'Tiruchirappalli', 'organizers team', 'FAQ', 'techfest info', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'About Us | Yuva Tech-Fest 2025',
    description: 'Learn about the festival, our organizers, and frequently asked questions.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
