import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, BufferGeometry, Float32BufferAttribute } from 'three'
import { KidneyMetrics } from '../../types/medical'

interface BasicKidneyProps {
  patientData?: {
    kidneyMetrics: KidneyMetrics
  }
}

const createKidneyGeometry = () => {
  const geometry = new BufferGeometry()
  const vertices: number[] = []
  const indices: number[] = []
  
  const segments = 80
  const rings = 60
  
  for (let ring = 0; ring <= rings; ring++) {
    const v = ring / rings
    const theta = v * Math.PI
    
    for (let segment = 0; segment <= segments; segment++) {
      const u = segment / segments
      const phi = u * Math.PI * 2
      
      const indent = Math.max(0, Math.cos(phi + Math.PI) * 0.3)
      const radius = 1 - indent
      const scaleY = 1.8
      const scaleZ = 0.65
      
      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = scaleY * Math.cos(theta)
      const z = scaleZ * radius * Math.sin(theta) * Math.sin(phi)
      
      vertices.push(x, y, z)
    }
  }
  
  for (let ring = 0; ring < rings; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = ring * (segments + 1) + segment
      const b = a + segments + 1
      
      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }
  
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  
  return geometry
}

const BasicKidney: React.FC<BasicKidneyProps> = ({ patientData }) => {
  const leftKidneyRef = useRef<Mesh>(null!)
  const rightKidneyRef = useRef<Mesh>(null!)
  const bloodFlowRefs = useRef<Mesh[]>([])
  
  const kidneyGeometry = useMemo(() => createKidneyGeometry(), [])
  
  const healthMetrics = useMemo(() => {
    const eGFR = patientData?.kidneyMetrics?.eGFR || 45
    const creatinine = patientData?.kidneyMetrics?.creatinine || 2.1
    const proteinuria = patientData?.kidneyMetrics?.proteinuria || 150
    
    let kidneyColor = '#8B4513'
    let healthLevel = 1
    let damageLevel = 0
    let inflammationLevel = 0
    let scarringLevel = 0
    let bloodFlowIntensity = 1
    
    if (eGFR >= 90) {
      kidneyColor = '#A0522D'
      healthLevel = 1
      damageLevel = 0
      inflammationLevel = 0
      scarringLevel = 0
      bloodFlowIntensity = 1
    } else if (eGFR >= 60) {
      kidneyColor = '#B8860B'
      healthLevel = 0.85
      damageLevel = 0.15
      inflammationLevel = 0.2
      scarringLevel = 0.1
      bloodFlowIntensity = 0.9
    } else if (eGFR >= 30) {
      kidneyColor = '#CD853F'
      healthLevel = 0.6
      damageLevel = 0.4
      inflammationLevel = 0.5
      scarringLevel = 0.3
      bloodFlowIntensity = 0.7
    } else if (eGFR >= 15) {
      kidneyColor = '#D2691E'
      healthLevel = 0.35
      damageLevel = 0.65
      inflammationLevel = 0.7
      scarringLevel = 0.6
      bloodFlowIntensity = 0.5
    } else {
      kidneyColor = '#8B0000'
      healthLevel = 0.15
      damageLevel = 0.85
      inflammationLevel = 0.9
      scarringLevel = 0.8
      bloodFlowIntensity = 0.3
    }
    
    if (creatinine > 3) {
      damageLevel = Math.min(1, damageLevel + 0.2)
      scarringLevel = Math.min(1, scarringLevel + 0.15)
    }
    
    if (proteinuria > 300) {
      inflammationLevel = Math.min(1, inflammationLevel + 0.2)
      damageLevel = Math.min(1, damageLevel + 0.1)
    }
    
    return {
      kidneyColor,
      healthLevel,
      damageLevel,
      inflammationLevel,
      scarringLevel,
      bloodFlowIntensity
    }
  }, [
    patientData?.kidneyMetrics?.eGFR,
    patientData?.kidneyMetrics?.creatinine,
    patientData?.kidneyMetrics?.proteinuria
  ])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const pulseRate = 1.2 * healthMetrics.healthLevel
    const pulseAmount = 0.025 * healthMetrics.healthLevel
    const pulse = 1 + Math.sin(time * pulseRate) * pulseAmount
    
    if (leftKidneyRef.current) {
      leftKidneyRef.current.scale.set(pulse, pulse, pulse)
      leftKidneyRef.current.rotation.y = Math.sin(time * 0.15) * 0.08
    }
    if (rightKidneyRef.current) {
      rightKidneyRef.current.scale.set(pulse, pulse, pulse)
      rightKidneyRef.current.rotation.y = Math.sin(time * 0.15) * 0.08
    }
    
    const flowSpeed = 2 * healthMetrics.bloodFlowIntensity
    bloodFlowRefs.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y = Math.sin(time * flowSpeed + i * 0.5) * 2
        particle.material.opacity = (0.5 + Math.sin(time * 3 + i) * 0.3) * healthMetrics.bloodFlowIntensity
      }
    })
  })

  return (
    <group>
      {/* LEFT KIDNEY */}
      <group position={[-2.8, 0.5, 0]}>
        <mesh ref={leftKidneyRef} geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={healthMetrics.kidneyColor}
            roughness={0.65 + healthMetrics.damageLevel * 0.2}
            metalness={0.05}
            clearcoat={0.3 * healthMetrics.healthLevel}
            clearcoatRoughness={0.4 + healthMetrics.scarringLevel * 0.3}
            emissive={healthMetrics.kidneyColor}
            emissiveIntensity={0.12 * healthMetrics.healthLevel}
          />
        </mesh>
        
        {healthMetrics.damageLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.01}>
            <meshPhysicalMaterial
              color="#4A0E0E"
              roughness={0.9}
              transparent
              opacity={healthMetrics.scarringLevel * 0.4}
              side={2}
            />
          </mesh>
        )}
        
        {healthMetrics.inflammationLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.015}>
            <meshPhysicalMaterial
              color="#FF4500"
              roughness={0.5}
              transparent
              opacity={healthMetrics.inflammationLevel * 0.25}
              emissive="#FF4500"
              emissiveIntensity={healthMetrics.inflammationLevel * 0.3}
              side={2}
            />
          </mesh>
        )}
        
        <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.02}>
          <meshPhysicalMaterial
            color="#B8860B"
            roughness={0.7}
            transparent
            opacity={0.25 * healthMetrics.healthLevel}
            side={2}
          />
        </mesh>
      </group>

      {/* RIGHT KIDNEY */}
      <group position={[2.8, -0.4, 0]}>
        <mesh ref={rightKidneyRef} geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={healthMetrics.kidneyColor}
            roughness={0.65 + healthMetrics.damageLevel * 0.2}
            metalness={0.05}
            clearcoat={0.3 * healthMetrics.healthLevel}
            clearcoatRoughness={0.4 + healthMetrics.scarringLevel * 0.3}
            emissive={healthMetrics.kidneyColor}
            emissiveIntensity={0.12 * healthMetrics.healthLevel}
          />
        </mesh>
        
        {healthMetrics.damageLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.01}>
            <meshPhysicalMaterial
              color="#4A0E0E"
              roughness={0.9}
              transparent
              opacity={healthMetrics.scarringLevel * 0.4}
              side={2}
            />
          </mesh>
        )}
        
        {healthMetrics.inflammationLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.015}>
            <meshPhysicalMaterial
              color="#FF4500"
              roughness={0.5}
              transparent
              opacity={healthMetrics.inflammationLevel * 0.25}
              emissive="#FF4500"
              emissiveIntensity={healthMetrics.inflammationLevel * 0.3}
              side={2}
            />
          </mesh>
        )}
        
        <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.02}>
          <meshPhysicalMaterial
            color="#B8860B"
            roughness={0.7}
            transparent
            opacity={0.25 * healthMetrics.healthLevel}
            side={2}
          />
        </mesh>
      </group>

      {/* BLOOD VESSELS */}
      <group>
        <mesh position={[-2, 0.4, -1]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.09, 0.14, 2.5, 24]} />
          <meshPhysicalMaterial
            color="#DC143C"
            emissive="#DC143C"
            emissiveIntensity={0.6 * healthMetrics.bloodFlowIntensity}
          />
        </mesh>
        
        <mesh position={[2, -0.3, -1]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.09, 0.14, 2.5, 24]} />
          <meshPhysicalMaterial
            color="#DC143C"
            emissive="#DC143C"
            emissiveIntensity={0.6 * healthMetrics.bloodFlowIntensity}
          />
        </mesh>
        
        {Array.from({ length: Math.floor(20 * healthMetrics.bloodFlowIntensity) }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) bloodFlowRefs.current[i] = el }}
            position={[
              (i % 2 === 0 ? -2 : 2) + (Math.random() - 0.5) * 0.5,
              -2 + (i / 20) * 4,
              -1 + (Math.random() - 0.5) * 0.3
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial
              color="#FF0000"
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default BasicKidney