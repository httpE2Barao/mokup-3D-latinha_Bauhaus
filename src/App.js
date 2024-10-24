import { Environment, OrbitControls, SoftShadows, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import './App.css';

function Model(props) {
  const { scene } = useGLTF('/mokup-3D-latinha.gltf');

  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      // Personalizar o material do líquido
      if (node.name.toLowerCase().includes('liquid') || node.material.name.toLowerCase().includes('water')) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xADD8E6), // Azul claro e sutil (Light Blue)
          roughness: 0.05,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          transmission: 0.9, // Maior transparência
          ior: 1.33, // Índice de refração semelhante à água
          reflectivity: 0.9, // Aumentar a reflexão para simular efeitos de ray tracing
        });
      }
    }
  });

  return <primitive object={scene} {...props} />;
}

function App() {
  return (
    <div className='App'>
      <Canvas className='App-model' shadows camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />
        <Suspense fallback={null}>
          <SoftShadows samples={30} radius={5} />
          <Model scale={[20, 20, 20]} position={[0, -1.5, 0]} />
          {/* Utilizando um ambiente predefinido */}
          <Environment preset="studio" background />

          {/* Adicionar efeito de pós-processamento */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              intensity={0.06}
            />
          </EffectComposer>
        </Suspense>
        <OrbitControls />
        <mesh receiveShadow position={[0, -2, 0]}>
          <planeGeometry attach="geometry" args={[100, 100]} />
          <shadowMaterial attach="material" opacity={0.5} />
        </mesh>
      </Canvas>
      <footer className='App-footer'>
        Esse site foi feito por Elias Barão e Thiago Battista.
      </footer>
    </div>
  );
}

export default App;
