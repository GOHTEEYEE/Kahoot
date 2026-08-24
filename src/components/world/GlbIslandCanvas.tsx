"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { DoubleSide } from "three";

export const BOSS_HERO_GLB = "/worlds/shared/boss-hero.glb?v=1";

type Props = {
  reduced: boolean;
};

function BossModel() {
  const { scene } = useGLTF(BOSS_HERO_GLB, "/draco/");
  const cloned = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((obj) => {
      obj.frustumCulled = false;
      if ("isMesh" in obj && obj.isMesh) {
        const mesh = obj as { material?: { side: number } | Array<{ side: number }> };
        const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        for (const mat of mats) mat.side = DoubleSide;
      }
    });
    return next;
  }, [scene]);

  return <primitive object={cloned} />;
}

useGLTF.preload(BOSS_HERO_GLB, "/draco/");

export function GlbIslandCanvas({ reduced }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1.05, 2.55], fov: 30, near: 0.05, far: 80 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={1} />
      <hemisphereLight args={["#fff4dc", "#3a3a40", 0.5]} />
      <directionalLight position={[3.2, 5.2, 2.8]} intensity={1.65} />
      <directionalLight position={[-2.4, 1.4, -2]} intensity={0.38} />
      <Suspense fallback={null}>
        <Bounds fit margin={1.2}>
          <Center>
            <BossModel />
          </Center>
        </Bounds>
      </Suspense>
      <ContactShadows opacity={0.28} scale={5.5} blur={1.7} far={3.2} position={[0, -0.88, 0]} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.7}
      />
    </Canvas>
  );
}
