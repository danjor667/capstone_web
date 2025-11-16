import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface PatientKidney3DProps {
  mlPrediction?: any
  width?: number
  height?: number
}

const KidneyMesh: React.FC<{ mlPrediction?: any }> = ({ mlPrediction }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  // Mock ML prediction data if not provided
  const predictionData = useMemo(() => {
    if (mlPrediction) {
      return {
        stage: mlPrediction.predicted_stage || 1,
        confidence: mlPrediction.confidence || 0.8,
        healthScore: mlPrediction.kidney_health_score || 0.7,
        riskLevel: mlPrediction.risk_level || 'medium'
      }
    }
    return { stage: 2, confidence: 0.75, healthScore: 0.6, riskLevel: 'medium' }
  }, [mlPrediction])

  // Calculate visual properties based on CKD stage
  const visualProps = useMemo(() => {
    const { stage, healthScore, riskLevel } = predictionData
    
    // Color mapping based on kidney health
    const getKidneyColor = () => {
      if (stage === 0) return '#ff6b9d' // Healthy pink
      if (stage <= 1) return '#ffb3d9' // Light pink
      if (stage === 2) return '#ffb347' // Light orange
      if (stage === 3) return '#ff8c42' // Orange
      if (stage === 4) return '#d2691e' // Dark orange
      return '#8b0000' // Dark red for stage 5
    }

    const getDamageIntensity = () => {
      if (riskLevel === 'low') return 0.1
      if (riskLevel === 'medium') return 0.3
      if (riskLevel === 'high') return 0.6
      return 0.8
    }

    return {
      color: getKidneyColor(),
      scale: Math.max(0.6, 1 - (stage * 0.08)), // Gradual shrinkage
      roughness: Math.min(0.8, 0.2 + (stage * 0.12)), // Progressive roughness
      metalness: Math.min(0.3, stage * 0.05), // Slight metallic for damaged areas
      emissive: stage === 0 ? 0.15 : Math.max(0, 0.1 - (stage * 0.02)),
      pulseIntensity: Math.max(0.2, healthScore),
      damageIntensity: getDamageIntensity(),
      deformation: Math.min(0.3, stage * 0.05) // Shape irregularity
    }
  }, [predictionData])

  // Create kidney-like geometry
  const kidneyGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 32, 16)
    const positions = geometry.attributes.position.array as Float32Array
    
    // Modify vertices to create kidney shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      // const z = positions[i + 2] // Not used in current calculations
      
      // Create kidney indentation
      const indentFactor = Math.max(0, x) * 0.3
      positions[i] = x - indentFactor
      
      // Add damage deformation based on ML prediction
      const damageNoise = (Math.sin(x * 5) + Math.cos(y * 5)) * visualProps.deformation * 0.1
      positions[i] += damageNoise
      positions[i + 1] += damageNoise * 0.5
      positions[i + 2] += damageNoise * 0.3
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [visualProps.deformation])

  // Animation for pulsing and rotation
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Pulsing effect based on kidney function
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.04 * visualProps.pulseIntensity
      meshRef.current.scale.setScalar(visualProps.scale + pulse)
      
      // Gentle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={kidneyGeometry}>
        <meshStandardMaterial
          color={visualProps.color}
          roughness={visualProps.roughness}
          metalness={visualProps.metalness}
          emissive={visualProps.color}
          emissiveIntensity={visualProps.emissive}
        />
      </mesh>
      
      {/* Damage indicators for higher stages */}
      {predictionData.stage >= 3 && (
        <mesh position={[0.3, 0.2, 0.1]} scale={0.2}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#8b0000"
            roughness={0.9}
            emissive="#8b0000"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
      
      {/* Additional damage spots for stage 4-5 */}
      {predictionData.stage >= 4 && (
        <>
          <mesh position={[-0.2, -0.3, 0.2]} scale={0.15}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#654321" roughness={0.95} />
          </mesh>
          <mesh position={[0.1, 0.4, -0.2]} scale={0.1}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#8b0000" emissive="#8b0000" emissiveIntensity={0.2} />
          </mesh>
        </>
      )}
    </group>
  )
}

const PatientKidney3D: React.FC<PatientKidney3DProps> = ({ 
  mlPrediction, 
  width = 300, 
  height = 300 
}) => {
  return (
    <div style={{ width, height }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b9d" />
        
        <KidneyMesh mlPrediction={mlPrediction} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          maxDistance={5}
          minDistance={1.5}
        />
      </Canvas>
    </div>
  )
}

export default PatientKidney3D