import * as THREE from "three"
import { easing } from "maath"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, Bvh } from "@react-three/drei"
import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { Scene } from "./Scene"
import { ImagePricer } from "./ImagePricer"
import { Home } from "./Home"

function Scene3D() {
  return (
    <Canvas flat dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 1, 6], fov: 25, near: 1, far: 20 }}>
      <ambientLight intensity={1.5 * Math.PI} />
      <Sky />
      <Bvh firstHitOnly>
        <Selection>
          <Effects />
          <Scene rotation={[0, Math.PI / 2, 0]} position={[0, -1, -0.85]} />
        </Selection>
      </Bvh>
    </Canvas>
  )
}

export const App = () => {
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  
  return (
    <>
      {!isHomePage && (
        <nav className="nav-menu">
          <Link to="/" className="nav-home">
            Price a Pic
          </Link>
          <div className="nav-links">
            {/* HIDDEN - 3D Kitchen Nav Link
            <Link to="/3d-kitchen" className={location.pathname === "/3d-kitchen" ? "active" : ""}>
              3D Kitchen
            </Link>
            */}
            <Link to="/image-pricer" className={location.pathname === "/image-pricer" ? "active" : ""}>
              Image Pricer
            </Link>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* HIDDEN - 3D Kitchen Route
        <Route path="/3d-kitchen" element={<Scene3D />} />
        */}
        <Route path="/image-pricer" element={<ImagePricer />} />
      </Routes>
    </>
  )
}

function Effects() {
  const { size } = useThree()
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [state.pointer.x, 1 + state.pointer.y / 2, 8 + Math.atan(state.pointer.x * 2)], 0.3, delta)
    state.camera.lookAt(state.camera.position.x * 0.9, 0, -4)
  })
  return (
    <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
      <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={size.width * 1.25} edgeStrength={10} />
      <TiltShift2 samples={5} blur={0.1} />
      <ToneMapping />
    </EffectComposer>
  )
}
