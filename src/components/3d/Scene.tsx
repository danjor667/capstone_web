import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Box, CircularProgress } from '@mui/material'
import BasicKidney from './BasicKidney'

interface SceneProps {
  patientData?: any
}

const Scene: React.FC<SceneProps> = ({ patientData }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      position: 'relative', 
      borderRadius: 2, 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)',
      border: '1px solid rgba(0, 212, 255, 0.2)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: '#1a1f2e', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            color="#ffffff"
            castShadow
          />
          <directionalLight
            position={[-10, 5, -5]}
            intensity={0.8}
            color="#e3f2fd"
          />
          <pointLight position={[0, 8, 3]} intensity={1} color="#ffffff" />
          <pointLight position={[0, -3, 3]} intensity={0.5} color="#00d4ff" />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
              color="#0f1419"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          <group position={[0, 0, 0]}>
            <BasicKidney patientData={patientData} />
          </group>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            autoRotate={true}
            autoRotateSpeed={0.5}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
      
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <Suspense fallback={<CircularProgress size={40} sx={{ color: '#00d4ff' }} />}>
          <div />
        </Suspense>
      </Box>
    </Box>
  )
}

export default Scene