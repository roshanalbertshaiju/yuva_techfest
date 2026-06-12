'use client'

import React from 'react'
import Hero from './ui/animated-shader-hero'
import { GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const router = useRouter()

  const handleRegisterStudent = () => {
    router.push('/register?type=student')
  }

  const handleRegisterSponsor = () => {
    router.push('/contact?subject=Sponsor%20Inquiry')
  }

  return (
    <Hero
      id="home"
      trustBadge={{
        text: "SRM IST TIRUCHIRAPPALLI • 2025",
        icon: <GraduationCap size={14} className="text-[#ff7300] animate-pulse" />
      }}
      headline={{
        line1: "YUVA TECH-FEST",
        line2: "HACKATHON"
      }}
      subtitle="Push the boundaries of innovation at SRM Institute of Science & Technology, Tiruchirappalli. Build something extraordinary. Win something legendary."
      buttons={{
        primary: {
          text: "REGISTER AS STUDENT",
          onClick: handleRegisterStudent
        },
        secondary: {
          text: "REGISTER AS SPONSOR",
          onClick: handleRegisterSponsor
        }
      }}
    />
  )
}
