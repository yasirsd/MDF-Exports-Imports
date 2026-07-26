import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { origin, markets } from "@/lib/constants";
import { buildArc, latLngToVec3 } from "@/components/sections/globe/geo";

const RADIUS = 2;

useTexture.preload("/textures/earth-blue-marble.jpg");
useTexture.preload("/textures/earth-topology.png");

/** Earth — soft blue atmosphere only (no red halo / circular frame). */
function GlobeBody() {
  const [colorMap, bumpMap] = useTexture([
    "/textures/earth-blue-marble.jpg",
    "/textures/earth-topology.png",
  ]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
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
      {/* Soft limb light — fades into space, not a hard ring */}
      <mesh scale={1.035}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
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

/** A single glowing location marker with hover label. */
function Marker({ point, color, label, sub, size = 0.045 }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const pos = useMemo(() => latLngToVec3(point.lat, point.lng, RADIUS + 0.01), [point]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 1.8 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 8);
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
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.6, size * 2.1, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {hovered ? (
        <Html center distanceFactor={7} zIndexRange={[20, 0]}>
          <div className="whitespace-nowrap rounded-lg border border-white/15 bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {label}
            <span className="ml-1 font-normal text-white/60">{sub}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

/** Animated shipping lane with a travelling packet of light. */
function Arc({ curve, color, speed = 0.25, delay = 0 }) {
  const packetRef = useRef();
  const points = useMemo(() => curve.getPoints(80), [curve]);
  const lineGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    if (!packetRef.current) return;
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
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Rotating scene group. */
function Scene() {
  const groupRef = useRef();

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

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef} rotation={[0.32, -1.1, 0]}>
      <GlobeBody />
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
        <Arc key={i} curve={a.curve} color={a.color} delay={a.delay} speed={a.speed} />
      ))}
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0.25, 7.2], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
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
      <ambientLight intensity={0.95} />
      <directionalLight position={[5, 3, 5]} intensity={1.35} />
      <pointLight position={[-6, -2, -4]} intensity={0.35} color="#8eb8ff" />
      {/* Dense, drifting starfield inside the canvas (complements section Starfield) */}
      <Stars
        radius={120}
        depth={60}
        count={2800}
        factor={4.5}
        saturation={0}
        fade
        speed={1.1}
      />
      <Scene />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.6}
      />
    </Canvas>
  );
}
