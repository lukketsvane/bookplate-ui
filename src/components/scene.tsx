"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Badge } from './3d-badge'

export default function Scene() {
  return (
    <Suspense fallback={<div>Loading 3D objects...</div>}>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Badge />
        </Physics>
        <Environment preset="studio" />
        <OrbitControls />
      </Canvas>
    </Suspense>
  )
}