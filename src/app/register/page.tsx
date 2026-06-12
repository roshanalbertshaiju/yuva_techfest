import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Register | Yuva Tech-Fest',
  description: 'Join the Yuva Tech-Fest at SRM Institute of Science and Technology. Register as a Student Participant or Sponsor Partner.',
  keywords: ['register', 'registration', 'techfest registration', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Register | Yuva Tech-Fest',
    description: 'Secure your slot at SRM IST Trichy’s biggest technology festival. Register today.',
    type: 'website',
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
