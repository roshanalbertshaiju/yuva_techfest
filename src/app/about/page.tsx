import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us | Yuva Tech-Fest Hackathon 2025',
  description:
    'Learn about the premier 36-hour Yuva Tech-Fest Hackathon hosted by SRM IST Tiruchirappalli, meet the student organizers and team members, and check our FAQ list.',
  keywords: ['about SRM IST', 'Tiruchirappalli', 'organizers team', 'FAQ', 'hackathon info', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'About Us | Yuva Tech-Fest Hackathon 2025',
    description: 'Learn about the 36-hour hackathon, our organizers, and frequently asked questions.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
