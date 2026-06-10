import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Register | Yuva Tech-Fest Hackathon',
  description: 'Join the Yuva Tech-Fest Hackathon at SRM Institute of Science and Technology. Register as a Student Participant or Sponsor Partner.',
  keywords: ['register', 'registration', 'hackathon registration', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Register | Yuva Tech-Fest Hackathon',
    description: 'Secure your slot at SRM IST Trichy’s biggest code sprint. Register today.',
    type: 'website',
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
