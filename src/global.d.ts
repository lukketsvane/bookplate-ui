import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

declare module 'three-stdlib' {
  export interface GLTF {
    nodes: { [key: string]: THREE.Object3D }
    materials: { [key: string]: THREE.Material }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: React.FC<{ [key: string]: any }>
    meshLineMaterial: React.FC<{ [key: string]: any }>
  }
}

declare module 'meshline'