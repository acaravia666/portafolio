'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

function PrismMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  const { gl } = useThree()
  const prefersReducedMotion = useReducedMotion()

  // Track mouse position in normalized device coordinates
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  useFrame(() => {
    if (!meshRef.current || !edgesRef.current) return
    if (prefersReducedMotion) return

    // Auto-rotation
    meshRef.current.rotation.y += 0.003
    edgesRef.current.rotation.y = meshRef.current.rotation.y

    // Smooth cursor tracking (lerp)
    target.current.x += (mouse.current.x * 0.3 - target.current.x) * 0.05
    target.current.y += (mouse.current.y * 0.3 - target.current.y) * 0.05

    meshRef.current.rotation.x = (Math.PI / 12) + target.current.y
    meshRef.current.rotation.z = target.current.x * 0.2
    edgesRef.current.rotation.x = meshRef.current.rotation.x
    edgesRef.current.rotation.z = meshRef.current.rotation.z
  })

  const geometry = useMemo(() => new THREE.CylinderGeometry(1.2, 1.2, 2.4, 6), [])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1.2}
          color="#d0d0d0"
        />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#BBE405" />
      </lineSegments>
    </group>
  )
}

export default function HexPrism() {
  return (
    <div
      className="w-full h-full"
      aria-label="Prisma hexagonal decorativo, identidad visual HexaIA"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[-3, 4, 3]} intensity={2} color="#BBE405" />
        <spotLight position={[3, -2, 3]} intensity={0.8} color="#ffffff" />
        <Environment preset="studio" />
        <PrismMesh />
      </Canvas>
    </div>
  )
}
