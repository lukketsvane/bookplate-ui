import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
  }
}

useGLTF.preload('/card.glb')
useTexture.preload('/band.png')

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
  darkMode?: boolean
  imageUrl?: string
}

function Band({ maxSpeed = 1, minSpeed = 0, darkMode = false, imageUrl }: BandProps) {
  const band = useRef<THREE.Group>(null)
  const fixed = useRef<THREE.Group>(null)
  const j1 = useRef<THREE.Group>(null)
  const j2 = useRef<THREE.Group>(null)
  const [texture] = useTexture(['/band.png'])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    band.current!.rotation.x = Math.sin(t) * Math.PI * 0.0125
    band.current!.rotation.y = Math.cos(t) * Math.PI * 0.0125
    band.current!.rotation.z += delta * 0.25
    band.current!.position.y = Math.sin(t * 2) * 0.1
    j1.current!.rotation.y += delta * 2
    j2.current!.rotation.y += delta * 2
  })

  return (
    <group ref={fixed}>
      <group ref={band}>
        <mesh>
          <cylinderGeometry args={[1.4, 1.4, 0.1, 128, 16, true]} />
          <meshStandardMaterial
            color={darkMode ? '#2a3a3f' : 'white'}
            roughness={1}
            transparent
            opacity={0.7}
            side={THREE.Do
ubleSide}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[1.401, 1.401, 0.1, 128, 16, true]} />
          <meshStandardMaterial
            color={darkMode ? 'white' : '#2a3a3f'}
            roughness={1}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <group ref={j1}>
          <mesh position={[1.2, 0, 0]} scale={0.1}>
            <sphereGeometry args={[1, 16, 32]} />
            <meshStandardMaterial color="#FFDADA" roughness={0.5} />
          </mesh>
        </group>
        <group ref={j2}>
          <mesh position={[-1.2, 0, 0]} scale={0.1}>
            <sphereGeometry args={[1, 16, 32]} />
            <meshStandardMaterial color="#FFDADA" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

interface BadgeProps {
  darkMode?: boolean
  imageUrl?: string
}

export function Badge({ darkMode = false, imageUrl }: BadgeProps) {
  const { nodes, materials } = useGLTF('/card.glb') as GLTFResult
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (imageUrl) {
      new THREE.TextureLoader().load(imageUrl, (loadedTexture) => {
        setTexture(loadedTexture)
      })
    }
  }, [imageUrl])

  return (
    <group dispose={null}>
      <mesh geometry={nodes.Cube.geometry}>
        <meshStandardMaterial
          color={darkMode ? '#2a3a3f' : 'white'}
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        {texture && (
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>
      <Text
        position={[0, 0.41, 0.01]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color={darkMode ? 'white' : 'black'}
        anchorX="center"
        anchorY="middle"
      >
        Bookplate
      </Text>
      <Band darkMode={darkMode} imageUrl={imageUrl} />
    </group>
  )
}

useGLTF.preload('/card.glb')