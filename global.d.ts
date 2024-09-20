import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader'

declare module '*.glb' {
  const content: string
  export default content
}

declare module 'meshline' {
  export const MeshLineGeometry: any
  export const MeshLineMaterial: any
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

// If you need to use GLTF, you can create a type alias:
type GLTF = GLTFThree