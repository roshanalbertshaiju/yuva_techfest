import type { Metadata } from 'next'
import SponsorsClient from './SponsorsClient'

export const metadata: Metadata = {
  title: 'Our Sponsors | Yuva Tech-Fest 2025',
  description:
    'Connect with our amazing sponsors and partners supporting the Yuva Tech-Fest at SRM IST Tiruchirappalli. Download the sponsorship prospectus and participate.',
  keywords: ['corporate sponsors', 'partners', 'sponsorship prospectus', 'tech partners', 'blockchain partners', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Our Sponsors | Yuva Tech-Fest 2025',
    description: 'Connect with our corporate partners and sponsors supporting SRM IST Trichy\'s biggest tech festival.',
    type: 'website',
  },
}

export default function SponsorsPage() {
  return <SponsorsClient />
}
