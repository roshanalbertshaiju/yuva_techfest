'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CountdownBanner from '@/components/CountdownBanner'
import InteractiveLab from '@/components/InteractiveLab'
import Footer from '@/components/Footer'

export default function HomeClient() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative">
      {/* Scan line decorative effect */}
      <div className="scan-line" />

      <Navbar />

      <HeroSection />
      <CountdownBanner />
      <InteractiveLab />
      
      <Footer />
    </main>
  )
}
