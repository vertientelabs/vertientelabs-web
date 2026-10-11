"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// A loading dock in the brand palette: a truck is unloaded onto a conveyor,
// every package is scanned by the operator's tablet as it passes the arch,
// and lands on a pallet that is dispatched when full.

const COL = {
  obsidiana: "#0E0D0B",
  grafito: "#2B2824",
  niebla: "#8A847A",
  caliza: "#F3F0E9",
  ambar: "#FF7A1F",
  oxido: "#B24A06",
  miel: "#FFC98B",
  coral: "#FFB49C",
  bg: "#F3EEE5",
  yard: "#E6DFD2",
  dock: "#EEE9E0",
  trailerIn: "#DDD6CA",
};

const BELT = { start: -5.1, end: 2.3, top: 0.56, speed: 0.8 };
const SCAN_X = -0.6;
const BOX = new THREE.Vector3(0.56, 0.42, 0.5);
const BOX_Y = BELT.top + BOX.y / 2;
const PALLET = new THREE.Vector3(3.75, 0.2, 0); // x, top surface y, z
const SLOTS = 12;
const SPAWN_EVERY = 1.8;
const POOL = 20;
const OPERATOR = new THREE.Vector3(SCAN_X + 0.35, 0, 1.35);
const CAMERA = { position: new THREE.Vector3(5.8, 10.6, 16.2), target: new THREE.Vector3(-0.35, 0.45, 0), fov: 28.5 };
const POOL_INDEX = Array.from({ length: POOL }, (_, i) => i);

// Scratch objects for the frame loop (a single scene instance exists at a time).
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

type Mode = "idle" | "belt" | "lift" | "stacked";
type BoxState = { mode: Mode; x: number; t: number; slot: number; scanned: boolean; from: THREE.Vector3 };

const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const easeIn = (k: number) => k * k * k;
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

function slotPosition(i: number, out: THREE.Vector3) {
  const level = Math.floor(i / 4);
  const k = i % 4;
  return out.set(
    PALLET.x + (k % 2 ? 0.3 : -0.3),
    PALLET.y + BOX.y / 2 + level * (BOX.y + 0.02),
    PALLET.z + (k < 2 ? -0.27 : 0.27),
  );
}

function initialBoxes(): BoxState[] {
  const boxes: BoxState[] = Array.from({ length: POOL }, () => ({
    mode: "idle",
    x: 0,
    t: 0,
    slot: 0,
    scanned: false,
    from: new THREE.Vector3(),
  }));
  for (let i = 0; i < 5; i++) Object.assign(boxes[i], { mode: "stacked", slot: i, scanned: true });
  for (let k = 0; k < 5; k++) {
    const x = BELT.start + k * BELT.speed * SPAWN_EVERY;
    Object.assign(boxes[5 + k], { mode: "belt", x, scanned: x > SCAN_X });
  }
  return boxes;
}

function tabletTexture() {
  const c = document.createElement("canvas");
  c.width = 320;
  c.height = 220;
  const g = c.getContext("2d")!;
  g.fillStyle = "#14120F";
  g.fillRect(0, 0, 320, 220);
  g.fillStyle = COL.caliza;
  g.font = "600 17px ui-monospace, Menlo, monospace";
  g.fillText("MUELLE 2 · RECEPCIÓN", 18, 32);
  g.fillStyle = COL.ambar;
  g.beginPath();
  g.arc(296, 26, 6, 0, Math.PI * 2);
  g.fill();
  for (let i = 0; i < 4; i++) {
    const y = 58 + i * 34;
    g.fillStyle = i === 0 ? "rgba(255,122,31,.18)" : "rgba(243,240,233,.06)";
    g.fillRect(14, y, 292, 26);
    g.fillStyle = i === 0 ? COL.ambar : "#6E685F";
    g.fillRect(24, y + 8, 10, 10);
    g.fillStyle = i === 0 ? COL.caliza : "#8A847A";
    g.fillRect(46, y + 9, 120 - i * 14, 8);
    g.fillStyle = i === 0 ? COL.miel : "#4A4640";
    g.fillRect(246, y + 9, 46, 8);
  }
  g.fillStyle = "rgba(243,240,233,.12)";
  g.fillRect(14, 198, 292, 8);
  g.fillStyle = COL.ambar;
  g.fillRect(14, 198, 205, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** The brand V (manual geometry, one solid ink, inner stroke at 42%) for the trailer side. */
function vDecal() {
  const c = document.createElement("canvas");
  c.width = 500;
  c.height = 360;
  const g = c.getContext("2d")!;
  g.translate(-70, -150);
  g.scale(10, 10);
  g.strokeStyle = COL.ambar;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(10, 18);
  g.lineTo(32, 48);
  g.lineTo(54, 18);
  g.stroke();
  g.globalAlpha = 0.42;
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(18, 18);
  g.lineTo(32, 42);
  g.lineTo(46, 18);
  g.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------------------------------------------------------------- static set */

function Ground() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={COL.yard} roughness={1} />
      </mesh>
      {/* Parking bay markings */}
      {[-1.7, 1.7].map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[-8, -1.19, z]}>
          <planeGeometry args={[10, 0.06]} />
          <meshBasicMaterial color={COL.ambar} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Dock */}
      <mesh position={[1.1, -0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.8, 1.2, 4.2]} />
        <meshStandardMaterial color={COL.dock} roughness={0.95} />
      </mesh>
      <mesh position={[-3.29, -0.07, 0]}>
        <boxGeometry args={[0.04, 0.12, 4.2]} />
        <meshStandardMaterial color={COL.ambar} />
      </mesh>
      {[-1.45, 1.45].map((z) => (
        <mesh key={z} position={[-3.36, -0.42, z]} castShadow>
          <boxGeometry args={[0.14, 0.36, 0.3]} />
          <meshStandardMaterial color={COL.grafito} />
        </mesh>
      ))}
      {/* Walkway lines on the dock */}
      {[0.95, 1.85].map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[0.6, 0.002, z]}>
          <planeGeometry args={[7.4, 0.04]} />
          <meshBasicMaterial color={COL.niebla} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Truck({ boxGeo }: { boxGeo: THREE.BufferGeometry }) {
  const cargo = useRef<THREE.InstancedMesh>(null);
  const decal = useMemo(() => vDecal(), []);
  useEffect(() => () => decal.dispose(), [decal]);
  const slots = useMemo(() => {
    const out: THREE.Vector3[] = [];
    for (let ix = 0; ix < 4; ix++)
      for (let iz = 0; iz < 4; iz++)
        for (let iy = 0; iy < 4 - (ix === 3 ? 2 : 0) - (iz === 3 && ix > 1 ? 1 : 0); iy++)
          out.push(new THREE.Vector3(-9.05 + ix * 0.6, BOX.y / 2 + iy * 0.44, -0.95 + iz * 0.55));
    return out;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    slots.forEach((p, i) => cargo.current!.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
    cargo.current!.instanceMatrix.needsUpdate = true;
  }, [slots]);

  const shell = <meshStandardMaterial color={COL.caliza} roughness={0.7} />;
  const inner = <meshStandardMaterial color={COL.trailerIn} roughness={0.9} />;

  return (
    <group>
      {/* Trailer: closed box, open at the rear onto the dock */}
      <mesh position={[-6.4, -0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.2, 0.16, 2.6]} />
        {inner}
      </mesh>
      {[-1.26, 1.26].map((z) => (
        <mesh key={z} position={[-6.4, 1.3, z]} receiveShadow castShadow>
          <boxGeometry args={[6.2, 2.6, 0.08]} />
          {shell}
        </mesh>
      ))}
      <mesh position={[-9.46, 1.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.08, 2.6, 2.6]} />
        {shell}
      </mesh>
      <mesh position={[-6.4, 2.64, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.28, 0.08, 2.68]} />
        {shell}
      </mesh>
      {/* Side livery: ámbar band and the V symbol */}
      <mesh position={[-6.4, 0.02, 1.31]}>
        <boxGeometry args={[6.2, 0.2, 0.02]} />
        <meshStandardMaterial color={COL.ambar} />
      </mesh>
      <mesh position={[-4.35, 1.45, 1.31]}>
        <planeGeometry args={[1.3, 0.94]} />
        <meshStandardMaterial map={decal} transparent roughness={0.7} polygonOffset polygonOffsetFactor={-4} />
      </mesh>
      {/* Corner posts fully enclose the wall ends, so no faces are coplanar (avoids z-fighting). */}
      {[-3.33, -9.46].map((x) =>
        [-1.27, 1.27].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 1.3, z]} castShadow>
            <boxGeometry args={[0.15, 2.6, 0.15]} />
            <meshStandardMaterial color={COL.grafito} />
          </mesh>
        )),
      )}
      {/* Chassis and wheels */}
      <mesh position={[-6.7, -0.38, 0]} castShadow>
        <boxGeometry args={[5.6, 0.3, 1.7]} />
        <meshStandardMaterial color={COL.grafito} />
      </mesh>
      {[-4.4, -5.35, -10.1, -11.6].map((x) =>
        [-1.0, 1.0].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.76, z]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.34, 24]} />
            <meshStandardMaterial color={COL.obsidiana} roughness={0.8} />
          </mesh>
        )),
      )}
      {/* Cab */}
      <mesh position={[-10.75, 0.55, 0]} castShadow>
        <boxGeometry args={[2.1, 2.3, 2.4]} />
        <meshStandardMaterial color={COL.grafito} roughness={0.6} />
      </mesh>
      <mesh position={[-10.75, -0.42, 0]} castShadow>
        <boxGeometry args={[2.3, 0.5, 2.5]} />
        <meshStandardMaterial color={COL.obsidiana} />
      </mesh>
      <mesh position={[-10.55, 1.05, 1.205]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshStandardMaterial color={COL.obsidiana} roughness={0.15} metalness={0.4} />
      </mesh>
      <mesh position={[-10.75, 1.72, 0]}>
        <boxGeometry args={[2.12, 0.06, 2.42]} />
        <meshStandardMaterial color={COL.ambar} />
      </mesh>
      {/* Remaining load */}
      <instancedMesh ref={cargo} args={[boxGeo, undefined, slots.length]} castShadow receiveShadow>
        <meshStandardMaterial color={COL.miel} roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

function Conveyor() {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const count = Math.floor((BELT.end - BELT.start + 0.6) / 0.2);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const r = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    for (let i = 0; i < count; i++) {
      m.makeTranslation(BELT.start - 0.3 + i * 0.2, BELT.top - 0.055, 0).multiply(r);
      rollers.current!.setMatrixAt(i, m);
    }
    rollers.current!.instanceMatrix.needsUpdate = true;
  }, [count]);

  const len = BELT.end - BELT.start + 0.7;
  const cx = (BELT.start + BELT.end) / 2;
  return (
    <group>
      <instancedMesh ref={rollers} args={[undefined, undefined, count]} receiveShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.84, 12]} />
        <meshStandardMaterial color="#C9C2B6" metalness={0.3} roughness={0.45} />
      </instancedMesh>
      {[-0.47, 0.47].map((z) => (
        <mesh key={z} position={[cx, BELT.top - 0.06, z]} castShadow receiveShadow>
          <boxGeometry args={[len, 0.16, 0.06]} />
          <meshStandardMaterial color={COL.grafito} roughness={0.6} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, i) => BELT.start + 0.4 + i * ((len - 1.4) / 6)).map((x) =>
        [-0.42, 0.42].map((z) => (
          <mesh key={`${x}${z}`} position={[x, (BELT.top - 0.14) / 2, z]} castShadow>
            <boxGeometry args={[0.06, BELT.top - 0.14, 0.06]} />
            <meshStandardMaterial color={COL.grafito} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Operator({ headRef, tabletRef, screen }: { headRef: React.RefObject<THREE.Group | null>; tabletRef: React.RefObject<THREE.Group | null>; screen: THREE.Texture }) {
  return (
    // Built facing +z, turned to face the conveyor.
    <group position={OPERATOR} rotation-y={Math.PI + 0.25}>
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.42, 0]} castShadow>
            <boxGeometry args={[0.17, 0.78, 0.19]} />
            <meshStandardMaterial color={COL.grafito} roughness={0.8} />
          </mesh>
          <mesh position={[x, 0.05, 0.04]} castShadow>
            <boxGeometry args={[0.19, 0.1, 0.28]} />
            <meshStandardMaterial color={COL.obsidiana} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.07, 0]} scale={[1, 1, 0.78]} castShadow>
        <capsuleGeometry args={[0.2, 0.42, 6, 16]} />
        <meshStandardMaterial color={COL.caliza} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.04, 0]} scale={[1, 1, 0.8]} castShadow>
        <capsuleGeometry args={[0.215, 0.34, 6, 16]} />
        <meshStandardMaterial color={COL.ambar} roughness={0.7} />
      </mesh>
      {[0.94, 1.14].map((y) => (
        <mesh key={y} position={[0, y, 0]} scale={[1, 1, 0.8]}>
          <cylinderGeometry args={[0.222, 0.222, 0.035, 20]} />
          <meshStandardMaterial color={COL.caliza} emissive={COL.caliza} emissiveIntensity={0.25} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.2, 1.18, 0.16]} rotation={[-1.05, 0, side * -0.35]} castShadow>
          <capsuleGeometry args={[0.055, 0.3, 4, 10]} />
          <meshStandardMaterial color={COL.caliza} roughness={0.8} />
        </mesh>
      ))}
      <group ref={headRef} position={[0, 1.56, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 20, 16]} />
          <meshStandardMaterial color={COL.coral} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <sphereGeometry args={[0.158, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={COL.caliza} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.045, 0.03]}>
          <cylinderGeometry args={[0.175, 0.175, 0.018, 24]} />
          <meshStandardMaterial color={COL.caliza} roughness={0.4} />
        </mesh>
      </group>
      <group ref={tabletRef} position={[0, 1.2, 0.36]} rotation-x={-0.95}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.25, 0.02]} />
          <meshStandardMaterial color={COL.obsidiana} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.33, 0.22]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function ScanArch({ beamRef, lampRef }: { beamRef: React.RefObject<THREE.MeshBasicMaterial | null>; lampRef: React.RefObject<THREE.MeshStandardMaterial | null> }) {
  const h = 1.75;
  return (
    <group position={[SCAN_X, 0, 0]}>
      {[-0.66, 0.66].map((z) => (
        <mesh key={z} position={[0, h / 2, z]} castShadow>
          <boxGeometry args={[0.1, h, 0.1]} />
          <meshStandardMaterial color={COL.grafito} />
        </mesh>
      ))}
      <mesh position={[0, h, 0]} castShadow>
        <boxGeometry args={[0.2, 0.14, 1.42]} />
        <meshStandardMaterial color={COL.grafito} />
      </mesh>
      <mesh position={[0, h - 0.08, 0]}>
        <boxGeometry args={[0.08, 0.03, 1.2]} />
        <meshStandardMaterial ref={lampRef} color={COL.ambar} emissive={COL.ambar} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, (h + BELT.top) / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[1.2, h - BELT.top - 0.1]} />
        <meshBasicMaterial ref={beamRef} color={COL.ambar} transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------- simulation */

function Dock({ onScan, paused }: { onScan: (serial: number) => void; paused: boolean }) {
  const boxGeo = useMemo(() => new RoundedBoxGeometry(BOX.x, BOX.y, BOX.z, 3, 0.035), []);
  const screen = useMemo(() => tabletTexture(), []);
  const boxes = useRef<BoxState[]>(initialBoxes());
  const boxRefs = useRef<(THREE.Group | null)[]>([]);
  const labelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pallet = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tabletRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.MeshBasicMaterial>(null);
  const lampRef = useRef<THREE.MeshStandardMaterial>(null);
  const onScanRef = useRef(onScan);
  const sim = useRef({ spawn: 0.6, stack: 5, phase: "run" as "run" | "dispatch" | "refill", phaseT: 0, flash: 0, serial: 20480, scanBox: -1, palletOff: new THREE.Vector3() });

  const linkRef = useRef<THREE.Mesh>(null);
  const linkMat = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(
    () => () => {
      boxGeo.dispose();
      screen.dispose();
    },
    [boxGeo, screen],
  );

  useFrame((state, dtRaw) => {
    const dt = paused ? 0 : Math.min(dtRaw, 0.05);
    const s = sim.current;
    const all = boxes.current;
    const run = s.phase === "run";

    if (run && dt > 0) {
      s.spawn -= dt;
      if (s.spawn <= 0) {
        const b = all.find((b) => b.mode === "idle");
        if (b) Object.assign(b, { mode: "belt", x: BELT.start, scanned: false });
        s.spawn = SPAWN_EVERY;
      }
    }

    // Belt, front to back, keeping a gap if the head of the queue is held.
    const belt = all.map((b, i) => [b, i] as const).filter(([b]) => b.mode === "belt").sort((a, b) => b[0].x - a[0].x);
    let limit = BELT.end;
    for (const [b, i] of belt) {
      if (run) b.x += BELT.speed * dt;
      b.x = Math.min(b.x, limit);
      if (!b.scanned && b.x >= SCAN_X) {
        b.scanned = true;
        s.flash = 1;
        s.serial += 1;
        s.scanBox = i;
        onScanRef.current(s.serial);
      }
      if (b.x >= BELT.end - 1e-4 && run && s.stack < SLOTS) {
        Object.assign(b, { mode: "lift", t: 0, slot: s.stack++ });
        b.from.set(b.x, BOX_Y, 0);
      }
      limit = b.x - 0.72;
    }

    for (const b of all) {
      if (b.mode !== "lift") continue;
      b.t = Math.min(b.t + dt / 0.9, 1);
      if (b.t >= 1) b.mode = "stacked";
    }

    const lifting = all.some((b) => b.mode === "lift");
    if (s.phase === "run" && s.stack >= SLOTS && !lifting) Object.assign(s, { phase: "dispatch", phaseT: 0 });
    if (s.phase === "dispatch") {
      s.phaseT += dt;
      const k = Math.min(s.phaseT / 1.8, 1);
      s.palletOff.set(easeIn(k) * 7, 0, 0);
      if (k >= 1) {
        all.forEach((b) => b.mode === "stacked" && (b.mode = "idle"));
        Object.assign(s, { stack: 0, phase: "refill", phaseT: 0 });
      }
    } else if (s.phase === "refill") {
      s.phaseT += dt;
      const k = Math.min(s.phaseT / 1.3, 1);
      s.palletOff.set(0, 0, -(1 - easeOut(k)) * 6);
      if (k >= 1) Object.assign(s, { phase: "run" });
    } else {
      s.palletOff.set(0, 0, 0);
    }

    // Apply transforms
    all.forEach((b, i) => {
      const g = boxRefs.current[i];
      if (!g) return;
      g.visible = b.mode !== "idle";
      g.rotation.set(0, 0, 0);
      if (b.mode === "belt") g.position.set(b.x, BOX_Y, 0);
      else if (b.mode === "lift") {
        const e = easeInOut(b.t);
        slotPosition(b.slot, _a).add(s.palletOff);
        g.position.lerpVectors(b.from, _a, e);
        g.position.y += Math.sin(Math.PI * e) * 0.7;
        g.rotation.y = Math.sin(Math.PI * e) * 0.25;
      } else if (b.mode === "stacked") g.position.copy(slotPosition(b.slot, _a).add(s.palletOff));
      const label = labelRefs.current[i];
      if (label) label.visible = b.scanned;
    });
    pallet.current?.position.copy(PALLET).setY(0).add(s.palletOff);

    // Scanner feedback
    s.flash = Math.max(0, s.flash - dt * 1.6);
    if (beamRef.current) beamRef.current.opacity = 0.05 + s.flash * 0.4;
    if (lampRef.current) lampRef.current.emissiveIntensity = 0.6 + s.flash * 3;
    // Beam from the tablet to the package it just read
    const target = s.scanBox >= 0 ? boxRefs.current[s.scanBox] : null;
    const link = linkRef.current;
    if (link && linkMat.current) {
      link.visible = !!target && !!tabletRef.current && s.flash > 0.01;
      if (link.visible && target && tabletRef.current) {
        tabletRef.current.getWorldPosition(_a);
        _b.copy(target.position).setY(target.position.y + 0.1);
        link.position.lerpVectors(_a, _b, 0.5);
        const len = _a.distanceTo(_b);
        link.scale.set(1, len, 1);
        link.quaternion.setFromUnitVectors(_up, _b.sub(_a).normalize());
        linkMat.current.opacity = s.flash;
      }
    }

    // Operator follows the package passing under the arch
    const watch = belt.find(([b]) => b.x < SCAN_X + 0.6)?.[0];
    const yaw = watch ? THREE.MathUtils.clamp((watch.x - OPERATOR.x) * 0.45, -0.7, 0.7) : 0;
    if (headRef.current) headRef.current.rotation.y += (-yaw - headRef.current.rotation.y) * Math.min(dt * 4, 1);

    // Camera: slow drift plus a little pointer parallax
    const tt = state.clock.elapsedTime;
    _a.copy(CAMERA.position);
    _a.x += Math.sin(tt * 0.12) * 0.5 + state.pointer.x * 0.9;
    _a.y += state.pointer.y * 0.5;
    state.camera.position.lerp(_a, 0.04);
    state.camera.lookAt(CAMERA.target);
  });

  return (
    <group>
      <Ground />
      <Truck boxGeo={boxGeo} />
      <Conveyor />
      <ScanArch beamRef={beamRef} lampRef={lampRef} />
      <Operator headRef={headRef} tabletRef={tabletRef} screen={screen} />
      <mesh ref={linkRef} visible={false}>
        <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
        <meshBasicMaterial ref={linkMat} color={COL.ambar} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={pallet}>
        {[-0.5, 0, 0.5].map((z) => (
          <mesh key={z} position={[0, 0.04, z]} castShadow receiveShadow>
            <boxGeometry args={[1.32, 0.08, 0.14]} />
            <meshStandardMaterial color={COL.oxido} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.32, 0.1, 1.16]} />
          <meshStandardMaterial color={COL.oxido} roughness={0.9} />
        </mesh>
      </group>

      {POOL_INDEX.map((i) => (
        <group key={i} ref={(g) => void (boxRefs.current[i] = g)} visible={false}>
          <mesh geometry={boxGeo} castShadow receiveShadow>
            <meshStandardMaterial color={COL.miel} roughness={0.85} />
          </mesh>
          <mesh position={[0, BOX.y / 2 + 0.002, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[BOX.x * 0.98, 0.09]} />
            <meshStandardMaterial color={COL.caliza} roughness={0.6} />
          </mesh>
          <mesh ref={(m) => void (labelRefs.current[i] = m)} position={[0.08, 0, BOX.z / 2 + 0.003]} visible={false}>
            <planeGeometry args={[0.22, 0.14]} />
            <meshBasicMaterial color={COL.ambar} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type SceneProps = { onScan: (serial: number) => void; active: boolean; reducedMotion: boolean };

function LogisticsScene({ onScan, active, reducedMotion }: SceneProps) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      flat
      dpr={[1, 1.75]}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      camera={{ position: CAMERA.position.toArray(), fov: CAMERA.fov, near: 0.5, far: 80 }}
      gl={{ antialias: true }}
      onCreated={({ camera }) => camera.lookAt(CAMERA.target)}
    >
      <color attach="background" args={[COL.bg]} />
      <fog attach="fog" args={[COL.bg, 24, 40]} />
      <hemisphereLight args={[COL.caliza, "#C9BFAE", 1.15]} />
      <directionalLight
        position={[6, 11, 7]}
        intensity={1.9}
        color="#FFF4E6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-12}
        shadow-camera-right={9}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Dock onScan={onScan} paused={reducedMotion} />
    </Canvas>
  );
}

export default memo(LogisticsScene);
