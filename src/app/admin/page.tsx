import type { Metadata } from 'next'
import AdminClient from './AdminClient'

export const metadata: Metadata = {
  title: 'Admin Console | Yuva Tech-Fest',
  description: 'Secure coordinator command center for managing student registrations and sponsorships.',
}

export default function AdminPage() {
  return <AdminClient />
}
