import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { origin, markets } from "@/lib/constants";
import { buildArc, latLngToVec3 } from "@/components/sections/globe/geo";

const RADIUS = 2;
const SCALE_TMP = new THREE.Vector3();

function isMobile() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

/** Earth. Soft blue atmosphere only (no red halo / circular frame). */
function GlobeBody({ segments = 64 }) {
  const [colorMap, bumpMap] = useTexture([
    "/textures/earth-blue-marble.jpg",
    "/textures/earth-topology.jpg",
  ]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS, segments, segments]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          metalness={0.1}
          roughness={0.78}
          emissive="#0a1622"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[RADIUS, Math.max(24, segments / 2), Math.max(24, segments / 2)]} />
        <meshBasicMaterial
          color="#6aa8ff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Marker({ point, color, label, sub, size = 0.045 }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const pos = useMemo(() => latLngToVec3(point.lat, point.lng, RADIUS + 0.01), [point]);

  useEffect(() => {
    return () => {
      // Avoid sticky pointer cursor if unmounted while hovered.
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 1.8 : 1;
    // Skip work when idle at rest scale.
    if (!hovered && Math.abs(ref.current.scale.x - 1) < 0.01) {
      if (ref.current.scale.x !== 1) ref.current.scale.setScalar(1);
      return;
    }
    SCALE_TMP.set(target, target, target);
    ref.current.scale.lerp(SCALE_TMP, delta * 8);
  });

  return (
    <group position={pos}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.6, size * 2.1, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {hovered ? (
        <Html center distanceFactor={7} zIndexRange={[20, 0]}>
          <div className="whitespace-nowrap rounded-lg border border-white/15 bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            {label}
            <span className="ml-1 font-normal text-white/60">{sub}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Arc({ curve, color, speed = 0.25, delay = 0, playing }) {
  const packetRef = useRef();
  const points = useMemo(() => curve.getPoints(64), [curve]);
  const lineGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useEffect(() => {
    return () => {
      lineGeom.dispose();
    };
  }, [lineGeom]);

  useFrame((state) => {
    if (!playing || !packetRef.current) return;
    const t = ((state.clock.elapsedTime * speed + delay) % 1 + 1) % 1;
    const p = curve.getPointAt(t);
    packetRef.current.position.copy(p);
    const scale = Math.sin(t * Math.PI);
    packetRef.current.scale.setScalar(0.4 + scale);
  });

  return (
    <group>
      <line geometry={lineGeom}>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </line>
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene({ mobile, playing }) {
  const groupRef = useRef();
  const { invalidate } = useThree();

  const arcs = useMemo(
    () =>
      markets.map((m, i) => ({
        curve: buildArc(origin, m, RADIUS + 0.01),
        color: m.status === "future" ? "#fdc500" : "#ef233c",
        delay: (i / markets.length) * 1,
        speed: 0.16 + (i % 3) * 0.05,
      })),
    []
  );

  // Single invalidate owner. Only while playing + tab visible.
  useFrame((_, delta) => {
    if (!playing) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible") {
      return;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      invalidate();
    }
  });

  return (
    <group ref={groupRef} rotation={[0.32, -1.1, 0]}>
      <GlobeBody segments={mobile ? 48 : 64} />
      <Marker point={origin} color="#fdc500" label={origin.name} sub={origin.country} size={0.06} />
      {markets.map((m) => (
        <Marker
          key={m.name}
          point={m}
          color={m.status === "future" ? "#fdc500" : "#22C55E"}
          label={m.name}
          sub={m.country}
        />
      ))}
      {arcs.map((a, i) => (
        <Arc
          key={i}
          curve={a.curve}
          color={a.color}
          delay={a.delay}
          speed={a.speed}
          playing={playing}
        />
      ))}
    </group>
  );
}

function VisibilityPause({ playing }) {
  const { invalidate } = useThree();
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && playing) invalidate();
    };
    document.addEventListener("visibilitychange", onVis);
    if (playing) invalidate();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [invalidate, playing]);
  return null;
}

function Controls({ playing }) {
  const { invalidate } = useThree();
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate={false}
      enabled={playing}
      rotateSpeed={0.5}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.6}
      onChange={() => {
        if (playing) invalidate();
      }}
    />
  );
}

/**
 * @param {{ playing?: boolean }} props
 * playing=false freezes the last frame (no RAF/invalidate) while keeping the canvas mounted.
 */
export default function Globe({ playing = true }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  const starCount = mobile ? 600 : 1400;
  const dpr = mobile ? [1, 1.15] : [1, 1.5];

  return (
    <Canvas
      camera={{ position: [0, 0.25, 7.2], fov: 38 }}
      dpr={dpr}
      frameloop="demand"
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        touchAction: "pan-y",
      }}
      className="!absolute inset-0 h-full w-full"
    >
      <VisibilityPause playing={playing} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[5, 3, 5]} intensity={1.35} />
      <pointLight position={[-6, -2, -4]} intensity={0.35} color="#8eb8ff" />
      <Stars
        radius={120}
        depth={50}
        count={starCount}
        factor={mobile ? 3.2 : 4}
        saturation={0}
        fade
        speed={0}
      />
      <Scene mobile={mobile} playing={playing} />
      <Controls playing={playing} />
    </Canvas>
  );
}
