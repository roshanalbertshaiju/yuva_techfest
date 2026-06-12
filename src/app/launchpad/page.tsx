import type { Metadata } from 'next'
import LaunchpadClient from './LaunchpadClient'

export const metadata: Metadata = {
  title: 'Startup Launchpad | Yuva Tech-Fest',
  description: 'The startup arena for India’s next breakout founders. Pitch to VCs, showcase your MVP, and secure funding at Yuva Tech-Fest.',
  keywords: ['startup launchpad', 'VC pitching', 'startup expo', 'incubator', 'funding', 'SRM IST', 'Yuva Tech-Fest'],
}

export default function LaunchpadPage() {
  return <LaunchpadClient />
}
