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
        if ('opacity' in particle.material) {
          particle.material.opacity = (0.5 + Math.sin(time * 3 + i) * 0.3) * healthMetrics.bloodFlowIntensity
        }
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
            <meshPhysicalMaterial color="#4A0E0E" roughness={0.9} transparent opacity={healthMetrics.scarringLevel * 0.4} side={2} />
          </mesh>
        )}
        {healthMetrics.inflammationLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.015}>
            <meshPhysicalMaterial color="#FF4500" roughness={0.5} transparent opacity={healthMetrics.inflammationLevel * 0.25} emissive="#FF4500" emissiveIntensity={healthMetrics.inflammationLevel * 0.3} side={2} />
          </mesh>
        )}
        <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.02}>
          <meshPhysicalMaterial color="#B8860B" roughness={0.7} transparent opacity={0.25 * healthMetrics.healthLevel} side={2} />
        </mesh>
        <mesh geometry={kidneyGeometry} rotation={[0, 0.4, 0.2]} scale={1.04}>
          <meshPhysicalMaterial color="#DEB887" roughness={0.3} metalness={0.1} transparent opacity={0.15} side={2} />
        </mesh>
        <mesh position={[0.7, 0, 0]} scale={[0.6, 1.2, 1]}>
          <sphereGeometry args={[0.5, 48, 48]} />
          <meshPhysicalMaterial color="#4A0E0E" roughness={0.8} emissive="#8B0000" emissiveIntensity={0.25} />
        </mesh>
        <group position={[0.6, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshPhysicalMaterial color="#FFD700" roughness={0.2} metalness={0.3} emissive="#FFD700" emissiveIntensity={0.5 * healthMetrics.healthLevel} clearcoat={0.5} />
          </mesh>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
            <mesh key={i} position={[0.1, y, 0]}>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshPhysicalMaterial color="#FFA500" roughness={0.3} emissive="#FFA500" emissiveIntensity={0.4 * healthMetrics.healthLevel} />
            </mesh>
          ))}
        </group>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 0.4
          return (
            <mesh key={i} position={[Math.cos(angle) * radius, (i % 3 - 1) * 0.4, Math.sin(angle) * radius * 0.6]} rotation={[0, angle, 0]}>
              <coneGeometry args={[0.12, 0.35, 8]} />
              <meshStandardMaterial color="#6B3410" roughness={0.75} emissive="#4A0E0E" emissiveIntensity={0.1} />
            </mesh>
          )
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.4]} scale={[0.08, 0.6, 0.08]}>
              <cylinderGeometry args={[1, 1, 1, 8]} />
              <meshStandardMaterial color="#A0522D" roughness={0.7} />
            </mesh>
          )
        })}
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
            <meshPhysicalMaterial color="#4A0E0E" roughness={0.9} transparent opacity={healthMetrics.scarringLevel * 0.4} side={2} />
          </mesh>
        )}
        {healthMetrics.inflammationLevel > 0.3 && (
          <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.015}>
            <meshPhysicalMaterial color="#FF4500" roughness={0.5} transparent opacity={healthMetrics.inflammationLevel * 0.25} emissive="#FF4500" emissiveIntensity={healthMetrics.inflammationLevel * 0.3} side={2} />
          </mesh>
        )}
        <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.02}>
          <meshPhysicalMaterial color="#B8860B" roughness={0.7} transparent opacity={0.25 * healthMetrics.healthLevel} side={2} />
        </mesh>
        <mesh geometry={kidneyGeometry} rotation={[0, -0.4, -0.2]} scale={1.04}>
          <meshPhysicalMaterial color="#DEB887" roughness={0.3} metalness={0.1} transparent opacity={0.15} side={2} />
        </mesh>
        <mesh position={[-0.7, 0, 0]} scale={[0.6, 1.2, 1]}>
          <sphereGeometry args={[0.5, 48, 48]} />
          <meshPhysicalMaterial color="#4A0E0E" roughness={0.8} emissive="#8B0000" emissiveIntensity={0.25} />
        </mesh>
        <group position={[-0.6, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshPhysicalMaterial color="#FFD700" roughness={0.2} metalness={0.3} emissive="#FFD700" emissiveIntensity={0.5 * healthMetrics.healthLevel} clearcoat={0.5} />
          </mesh>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((y, i) => (
            <mesh key={i} position={[-0.1, y, 0]}>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshPhysicalMaterial color="#FFA500" roughness={0.3} emissive="#FFA500" emissiveIntensity={0.4 * healthMetrics.healthLevel} />
            </mesh>
          ))}
        </group>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 0.4
          return (
            <mesh key={i} position={[Math.cos(angle) * radius, (i % 3 - 1) * 0.4, Math.sin(angle) * radius * 0.6]} rotation={[0, angle + Math.PI, 0]}>
              <coneGeometry args={[0.12, 0.35, 8]} />
              <meshStandardMaterial color="#6B3410" roughness={0.75} emissive="#4A0E0E" emissiveIntensity={0.1} />
            </mesh>
          )
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.4]} scale={[0.08, 0.6, 0.08]}>
              <cylinderGeometry args={[1, 1, 1, 8]} />
              <meshStandardMaterial color="#A0522D" roughness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* COMPLEX VASCULAR SYSTEM */}
      <group>
        <mesh position={[0, 0, -1.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 7, 32]} />
          <meshPhysicalMaterial color="#B22222" roughness={0.35} metalness={0.4} emissive="#B22222" emissiveIntensity={0.5 * healthMetrics.bloodFlowIntensity} clearcoat={0.6} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, -3 + i * 0.8, -1.2]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 24]} />
            <meshStandardMaterial color="#8B0000" emissive="#8B0000" emissiveIntensity={0.3 * healthMetrics.bloodFlowIntensity} />
          </mesh>
        ))}
        <group>
          <mesh position={[-2, 0.4, -1]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.09, 0.14, 2.5, 24]} />
            <meshPhysicalMaterial color="#DC143C" roughness={0.3} metalness={0.4} emissive="#DC143C" emissiveIntensity={0.6 * healthMetrics.bloodFlowIntensity} clearcoat={0.7} />
          </mesh>
          {[-0.3, -0.1, 0.1, 0.3].map((offset, i) => (
            <mesh key={i} position={[-2.5, 0.5 + offset, -0.2]} rotation={[0.4, 0, 0.8]}>
              <cylinderGeometry args={[0.04, 0.07, 1.2, 16]} />
              <meshPhysicalMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.5 * healthMetrics.bloodFlowIntensity} />
            </mesh>
          ))}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh key={i} position={[-2.8 + Math.cos(angle) * 0.3, 0.5, Math.sin(angle) * 0.2]} rotation={[angle, 0, 0]} scale={[1, 0.8, 1]}>
                <cylinderGeometry args={[0.02, 0.04, 0.6, 12]} />
                <meshStandardMaterial color="#FF6347" emissive="#FF6347" emissiveIntensity={0.4 * healthMetrics.bloodFlowIntensity} />
              </mesh>
            )
          })}
        </group>
        <group>
          <mesh position={[2, -0.3, -1]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.09, 0.14, 2.5, 24]} />
            <meshPhysicalMaterial color="#DC143C" roughness={0.3} metalness={0.4} emissive="#DC143C" emissiveIntensity={0.6 * healthMetrics.bloodFlowIntensity} clearcoat={0.7} />
          </mesh>
          {[-0.3, -0.1, 0.1, 0.3].map((offset, i) => (
            <mesh key={i} position={[2.5, -0.4 + offset, -0.2]} rotation={[-0.4, 0, -0.8]}>
              <cylinderGeometry args={[0.04, 0.07, 1.2, 16]} />
              <meshPhysicalMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.5 * healthMetrics.bloodFlowIntensity} />
            </mesh>
          ))}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh key={i} position={[2.8 + Math.cos(angle) * 0.3, -0.4, Math.sin(angle) * 0.2]} rotation={[angle, 0, 0]} scale={[1, 0.8, 1]}>
                <cylinderGeometry args={[0.02, 0.04, 0.6, 12]} />
                <meshStandardMaterial color="#FF6347" emissive="#FF6347" emissiveIntensity={0.4 * healthMetrics.bloodFlowIntensity} />
              </mesh>
            )
          })}
        </group>
        <mesh position={[0.5, 0, -0.9]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 7, 32]} />
          <meshPhysicalMaterial color="#4682B4" roughness={0.35} metalness={0.3} emissive="#4682B4" emissiveIntensity={0.4 * healthMetrics.bloodFlowIntensity} clearcoat={0.5} />
        </mesh>
        <mesh position={[-1.8, 0.3, -0.8]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.11, 0.16, 2.2, 24]} />
          <meshPhysicalMaterial color="#4169E1" roughness={0.3} metalness={0.3} emissive="#4169E1" emissiveIntensity={0.4 * healthMetrics.bloodFlowIntensity} clearcoat={0.6} />
        </mesh>
        <mesh position={[1.8, -0.4, -0.8]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.11, 0.16, 2.2, 24]} />
          <meshPhysicalMaterial color="#4169E1" roughness={0.3} metalness={0.3} emissive="#4169E1" emissiveIntensity={0.4 * healthMetrics.bloodFlowIntensity} clearcoat={0.6} />
        </mesh>
        {Array.from({ length: Math.floor(20 * healthMetrics.bloodFlowIntensity) }).map((_, i) => (
          <mesh key={i} ref={(el) => { if (el) bloodFlowRefs.current[i] = el }} position={[(i % 2 === 0 ? -2 : 2) + (Math.random() - 0.5) * 0.5, -2 + (i / 20) * 4, -1 + (Math.random() - 0.5) * 0.3]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
      <group>
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 12
          return (
            <mesh key={i} position={[-2.5, -1.5 - t * 2.5, 0.1]} rotation={[0.6 + t * 0.2, 0, 0.1]} scale={[1, 1 + Math.sin(t * Math.PI) * 0.2, 1]}>
              <cylinderGeometry args={[0.045, 0.045, 0.25, 16]} />
              <meshPhysicalMaterial color="#F0E68C" roughness={0.4} emissive="#F0E68C" emissiveIntensity={0.25} clearcoat={0.3} />
            </mesh>
          )
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 12
          return (
            <mesh key={i} position={[2.5, -1.7 - t * 2.5, 0.1]} rotation={[0.6 + t * 0.2, 0, -0.1]} scale={[1, 1 + Math.sin(t * Math.PI) * 0.2, 1]}>
              <cylinderGeometry args={[0.045, 0.045, 0.25, 16]} />
              <meshPhysicalMaterial color="#F0E68C" roughness={0.4} emissive="#F0E68C" emissiveIntensity={0.25} clearcoat={0.3} />
            </mesh>
          )
        })}
      </group>
      <group>
        <mesh position={[-2.8, 2.2, 0.4]} rotation={[0.3, 0, 0.2]}>
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial color="#DAA520" roughness={0.6} emissive="#DAA520" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[2.8, 1.6, 0.4]} rotation={[-0.3, 0, -0.2]}>
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial color="#DAA520" roughness={0.6} emissive="#DAA520" emissiveIntensity={0.25} />
        </mesh>
      </group>
      <mesh position={[-2.8, 0.5, 0]} scale={[1.4, 2.1, 1.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#FFFACD" roughness={0.9} transparent opacity={0.12} side={2} />
      </mesh>
      <mesh position={[2.8, -0.4, 0]} scale={[1.4, 2.1, 1.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#FFFACD" roughness={0.9} transparent opacity={0.12} side={2} />
      </mesh>
    </group>
  )
}

export default BasicKidney