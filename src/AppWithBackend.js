import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Routes, Route, Link, useLocation } from "react-router-dom"
import * as THREE from "three"
import { easing } from "maath"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, Bvh } from "@react-three/drei"
import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"
import { Scene } from "./Scene"
import { ImagePricer } from "./ImagePricer"
import { ImagePricerWithBackend } from "./ImagePricerWithBackend"
import config from './amplifyconfiguration.json';

// Only configure Amplify if we have real values (not PLACEHOLDER)
if (config.aws_user_pools_id !== 'PLACEHOLDER') {
  Amplify.configure(config);
}

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

function AppContent() {
  const location = useLocation()
  const isBackendConfigured = config.aws_user_pools_id !== 'PLACEHOLDER'
  
  return (
    <>
      <nav className="nav-menu">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          3D Kitchen
        </Link>
        <Link to="/image-pricer" className={location.pathname === "/image-pricer" ? "active" : ""}>
          Image Pricer {isBackendConfigured && "☁️"}
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Scene3D />} />
        <Route 
          path="/image-pricer" 
          element={
            isBackendConfigured ? (
              <Authenticator>
                {({ signOut, user }) => (
                  <div>
                    <div style={{ position: 'absolute', top: '70px', right: '20px', zIndex: 1000 }}>
                      <button onClick={signOut} className="sign-out-button">
                        Sign Out ({user.signInDetails?.loginId})
                      </button>
                    </div>
                    <ImagePricerWithBackend user={user} />
                  </div>
                )}
              </Authenticator>
            ) : (
              <ImagePricer />
            )
          } 
        />
      </Routes>
    </>
  )
}

export function AppWithBackend() {
  return <AppContent />
}

