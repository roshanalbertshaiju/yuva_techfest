'use client'

import React from 'react'
import Hero from './ui/animated-shader-hero'

export default function HeroSection() {
  const handleRegisterStudent = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegisterSponsor = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Hero
      id="home"
      trustBadge={{
        text: "SRM IST TIRUCHIRAPPALLI • 2025",
        icons: ["✨"]
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
