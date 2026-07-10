'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Edges, MeshTransmissionMaterial, TorusKnot, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

const PRISM = {
  outer: { radius: 2.4, height: 4.8, sides: 6 },
  inner: { radius: 1.6, height: 3.2, sides: 6 },
  rotationSpeed: 0.15,
} as const

function HolographicGlassPrism({ degraded }: { degraded: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const { gl } = useThree()
  const prefersReducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)

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

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (prefersReducedMotion) return

    const t = state.clock.elapsedTime

    // Smooth target tracking for parallax
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x, 0.05)
    target.current.y = THREE.MathUtils.lerp(target.current.y, mouse.current.y, 0.05)

    // Base Group Rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (Math.PI / 12) + target.current.y * 0.4 + Math.sin(t * 0.5) * 0.1,
      0.1
    )
    groupRef.current.rotation.y += delta * PRISM.rotationSpeed
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      target.current.x * 0.4,
      0.1
    )

    // Inner mechanical core counter-rotations
    if (innerCoreRef.current && wireframeRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.8
      innerCoreRef.current.rotation.z = Math.sin(t) * 0.2
      wireframeRef.current.rotation.y -= delta * 0.5
      wireframeRef.current.rotation.x += delta * 0.3
    }

    // Explosive scale expansion on hover
    const scale = hovered ? 1.05 : 1
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.1))
  })

  // Significantly larger outer geometries (almost 2.5x larger)
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(PRISM.outer.radius, PRISM.outer.radius, PRISM.outer.height, PRISM.outer.sides),
    []
  )
  const innerHex = useMemo(
    () => new THREE.CylinderGeometry(PRISM.inner.radius, PRISM.inner.radius, PRISM.inner.height, PRISM.inner.sides),
    []
  )

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        
        {/* Outer Heavy Glass Prism */}
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            backside={false}
            samples={degraded ? 4 : 12}
            resolution={degraded ? 256 : 1024}
            transmission={1}
            roughness={0.05}
            thickness={3.5}
            ior={1.6}
            chromaticAberration={hovered ? 1.1 : 0.6}
            anisotropy={0.3}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#ffffff"
          />
          {/* Neon wireframe edges reacting to the outer bounding box */}
          <Edges 
            linewidth={hovered ? 3 : 1} 
            threshold={15} 
            color={hovered ? "#ffffff" : "#BBE405"} 
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Inner structural complex (The "System Core") */}
        <mesh ref={wireframeRef} geometry={innerHex}>
          <meshBasicMaterial
            color="#1a1a1a" // Dark skeletal lines inside the glass
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Central Glowing Processor */}
        <mesh ref={innerCoreRef} scale={[0.8, 0.8, 0.8]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial
            color="#BBE405"
            metalness={1}
            roughness={0.2}
            emissive="#BBE405"
            emissiveIntensity={hovered ? 1 : 0.4}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Complex Torus Ring swirling the core showing deep magenta dispersion */}
        <TorusKnot args={[1.2, 0.15, 120, 16]} scale={[0.8, 0.8, 0.8]}>
          <meshPhysicalMaterial
            color="#ff00ff"
            metalness={1}
            roughness={0}
            transmission={0.9} // Secondary glass layer inside the main glass!
            ior={1.2}
            iridescence={1}
            iridescenceIOR={1.4}
            emissive="#ff00ff"
            emissiveIntensity={hovered ? 0.3 : 0.05}
          />
        </TorusKnot>

      </Float>
    </group>
  )
}

export default function HexPrism() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [degraded, setDegraded] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative cursor-crosshair overflow-visible"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        style={{ pointerEvents: 'auto' }}
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />
        <AdaptiveDpr pixelated />

        <ambientLight intensity={0.5} />

        {/* Extreme lighting contrast for chromatic reflections */}
        <spotLight position={[-10, 10, 10]} intensity={25} color="#ff00ff" distance={40} penumbra={1} />
        <spotLight position={[10, -10, 10]} intensity={25} color="#00ffff" distance={40} penumbra={1} />
        <spotLight position={[0, 0, 5]} intensity={5} color="#ffffff" distance={20} penumbra={1} />
        <directionalLight position={[0, -5, -5]} intensity={3} color="#BBE405" />

        <Environment preset="city" />

        <HolographicGlassPrism degraded={degraded} />

        {/* Cinematic Bloom logic */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            mipmapBlur
            intensity={1.5}
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
