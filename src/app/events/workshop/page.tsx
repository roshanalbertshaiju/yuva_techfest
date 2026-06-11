import type { Metadata } from 'next'
import WorkshopClient from './WorkshopClient'

export const metadata: Metadata = {
  title: 'AI & Web3 Workshops | Developer Masterclasses',
  description:
    'Attend the AI and Web3 developer masterclasses at Yuva Tech-Fest SRM IST Tiruchirappalli. View the smart contract and LLM fine-tuning syllabus, prerequisites, and registration details.',
  keywords: ['workshops', 'developer masterclass', 'solidity smart contracts', 'LLM fine tuning', 'AI training', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'AI & Web3 Workshops | Developer Masterclasses',
    description: 'Attend hands-on workshops and earn developer certifications at Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function WorkshopPage() {
  return <WorkshopClient />
}
