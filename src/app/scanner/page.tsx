import type { Metadata } from 'next'
import ScannerClient from './ScannerClient'

export const metadata: Metadata = {
  title: 'Pass Scanner | Yuva Tech-Fest 2026',
  description: 'Event manager portal to scan QR code passes and check-in attendees.',
  openGraph: {
    title: 'Pass Scanner | Yuva Tech-Fest 2026',
    description: 'Check-in portal for SRM IST Trichy Yuva Tech-Fest organizers.',
    type: 'website',
  },
}

export default function ScannerPage() {
  return <ScannerClient />
}
