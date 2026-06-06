'use client'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      {/* Scan line decorative effect */}
      <div className="scan-line" />

      <Navbar />

      <HeroSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
