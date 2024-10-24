import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import './App.css';

function Model(props) {
  const { scene } = useGLTF('/mokup-3D-latinha.gltf');

  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;

      // Aplicar material apenas ao splash
      if (node.name.toLowerCase() === 'splash') {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xADD8E6), // Azul claro e sutil (Light Blue)
          roughness: 0.01, // Mantém o material suave, mas não totalmente reflexivo
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.0,
          transmission: 0.99, // Transparência quase total
          ior: 1.33, // Índice de refração semelhante à água
          reflectivity: 0.9, // Reflexão para simular efeitos realistas
          thickness: 0.05, // Controla a espessura para obter uma sensação de volume
          attenuationDistance: 2.0, // Aumenta a distância de atenuação para maior clareza
          attenuationColor: new THREE.Color(0xADD8E6) // Leve tom azulado
        });
      }
    }
  });

  return <primitive object={scene} {...props} />;
}

function App() {
  return (
    <div className='App'>
      <Canvas
        className='App-model'
        shadows
        gl={{ powerPreference: "high-performance", antialias: true }}
        camera={{ position: [5, 5, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          {/* Carregando o HDR que você baixou */}
          <Environment files="/808-hdri-skies-com.hdr" background />
          <ambientLight intensity={0.1} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={3}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <Model scale={[20, 20, 20]} position={[0, -1.5, 0]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <footer className='App-footer'>
        Esse site foi feito por Elias Barão e Thiago Battista.
      </footer>
    </div>
  );
}

export default App;
