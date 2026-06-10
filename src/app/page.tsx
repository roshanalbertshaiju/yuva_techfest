'use client'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CountdownBanner from '@/components/CountdownBanner'
import AboutSection from '@/components/AboutSection'
import InteractiveLab from '@/components/InteractiveLab'
import SponsorSection from '@/components/SponsorSection'
import FAQSection from '@/components/FAQSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      {/* Scan line decorative effect */}
      <div className="scan-line" />

      <Navbar />

      <HeroSection />
      <CountdownBanner />
      <AboutSection />
      <InteractiveLab />
      <SponsorSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
