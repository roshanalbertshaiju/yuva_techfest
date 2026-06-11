'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AboutSection from '@/components/AboutSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function AboutClient() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen pt-24 bg-[#020408]">
      {/* Scan line decorative effect */}
      <div className="scan-line" />

      <Navbar />

      <AboutSection />
      <FAQSection />

      <Footer />
    </main>
  )
}
