import type { Metadata } from 'next'
import TicketsClient from './TicketsClient'

export const metadata: Metadata = {
  title: 'My Passes | Yuva Tech-Fest 2025',
  description: 'View and manage your active entry tickets and passes for Yuva Tech-Fest events.',
  openGraph: {
    title: 'My Passes | Yuva Tech-Fest 2025',
    description: 'Access your QR code entry passes for SRM IST Trichy Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function TicketsPage() {
  return <TicketsClient />
}
