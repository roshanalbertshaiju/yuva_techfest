'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Particle Network ────────────────────────────────────────────────────────

function ParticleNetwork() {
  const meshRef = useRef<THREE.Points>(null)

  const COUNT = 200

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    const palette = [
      new THREE.Color('#00d4ff'),
      new THREE.Color('#0099ff'),
      new THREE.Color('#bf00ff'),
      new THREE.Color('#00ff9f'),
    ]

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.025
    meshRef.current.rotation.x = Math.sin(t * 0.015) * 0.15
  })

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Connection Lines ────────────────────────────────────────────────────────

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const geo = useMemo(() => {
    const pts: number[] = []
    const cls: number[] = []
    const nodeCount = 60
    const nodes: THREE.Vector3[] = []
    const maxDist = 5

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      ))
    }

    const blueColor  = new THREE.Color('#00d4ff')
    const purpleColor = new THREE.Color('#bf00ff')

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d = nodes[i].distanceTo(nodes[j])
        if (d < maxDist) {
          pts.push(nodes[i].x, nodes[i].y, nodes[i].z)
          pts.push(nodes[j].x, nodes[j].y, nodes[j].z)
          const alpha = 1 - d / maxDist
          const col   = Math.random() > 0.5 ? blueColor : purpleColor
          cls.push(col.r * alpha, col.g * alpha, col.b * alpha)
          cls.push(col.r * alpha * 0.3, col.g * alpha * 0.3, col.b * alpha * 0.3)
        }
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    g.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(cls), 3))
    return g
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    const t = state.clock.getElapsedTime()
    linesRef.current.rotation.y = t * 0.025
    linesRef.current.rotation.x = Math.sin(t * 0.015) * 0.15
  })

  return (
    <lineSegments ref={linesRef} geometry={geo}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}

// ─── Wireframe Torus Knot ─────────────────────────────────────────────────────

function WireframeTorus() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.x = t * 0.18
    groupRef.current.rotation.y = t * 0.12
    groupRef.current.rotation.z = t * 0.06
  })

  return (
    <group ref={groupRef} position={[4.5, 0, -3]}>
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 128, 16]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 128, 16]} />
        <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

// ─── Floating Icosahedron ─────────────────────────────────────────────────────

function FloatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.22
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.5
  })

  return (
    <mesh ref={meshRef} position={[-5, 1, -2]}>
      <icosahedronGeometry args={[1.0, 1]} />
      <meshBasicMaterial color="#00ff9f" wireframe transparent opacity={0.12} />
    </mesh>
  )
}

// ─── Mouse-reactive Camera Rig ────────────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  // useEffect ensures window access is client-only
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.025
    camera.position.y += (mouse.current.y * 0.8  - camera.position.y) * 0.025
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Main Canvas Export ───────────────────────────────────────────────────────

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <CameraRig />
      <ParticleNetwork />
      <ConnectionLines />
      <WireframeTorus />
      <FloatingIcosahedron />
    </Canvas>
  )
}
