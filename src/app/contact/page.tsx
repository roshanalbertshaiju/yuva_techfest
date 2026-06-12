import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | Yuva Tech-Fest 2026',
  description:
    'Get in touch with the student organizers and team behind the Yuva Tech-Fest at SRM IST Tiruchirappalli. Send us a message or join our Discord channel.',
  keywords: ['contact', 'email support', 'venue location', 'instagram', 'twitter', 'discord', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Contact Us | Yuva Tech-Fest 2026',
    description: 'Get in touch with the SRM IST Trichy Yuva Tech-Fest organizer team.',
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

export default function ContactPage() {
  return <ContactClient />
}
