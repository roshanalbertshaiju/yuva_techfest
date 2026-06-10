'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
}

export default function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    const maxParticles = 40
    const connectionDist = 90
    const mouseConnectionDist = 120
    let isLooping = false

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.2
        })
      }
    }

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 115, 0, ${p.alpha})`
        ctx.fill()
      })

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        
        // Connect to mouse
        const dxMouse = p1.x - mouseRef.current.x
        const dyMouse = p1.y - mouseRef.current.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < mouseConnectionDist) {
          const alpha = (1 - distMouse / mouseConnectionDist) * 0.25
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.strokeStyle = `rgba(255, 115, 0, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255, 115, 0, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const loop = () => {
      if (!isLooping) return
      updateAndDraw()
      animationRef.current = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (!isLooping) {
        isLooping = true
        loop()
      }
    }

    const stopLoop = () => {
      isLooping = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
    }

    // Set up resize handler
    window.addEventListener('resize', resize)
    resize()
    initParticles()

    // track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove)
      parent.addEventListener('mouseleave', handleMouseLeave)
    }

    // Performance safeguard: Pause loop when section leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.0 }
    )
    observer.observe(canvas)

    return () => {
      window.removeEventListener('resize', resize)
      observer.disconnect()
      stopLoop()
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
