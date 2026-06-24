"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { DroneSpec, CompatibilityLevel } from "@/lib/droneSpec";
import { compatColor } from "@/lib/droneSpec";

interface DroneViewProps {
  spec: DroneSpec;
  overallLevel: CompatibilityLevel;
  reducedMotion?: boolean;
}

// ── Helper to derive visual scale from spec ────────────────
function getVisualParams(spec: DroneSpec) {
  const propScale = spec.propIn / 5.1;
  const frameScale = spec.frameMm / 230;

  // Colors by style
  const styleAccent = {
    race: "#ff4060",
    freestyle: "#b060ff",
    cinematic: "#00aaff",
  }[spec.style];

  const batteryColor =
    spec.batteryS >= 5 ? "#ff8a3d" : spec.batteryS === 4 ? "#00e87a" : "#00aaff";

  return { propScale, frameScale, styleAccent, batteryColor };
}

export default function DroneView({ spec, overallLevel, reducedMotion = false }: DroneViewProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState({ x: -25, y: 35 }); // degrees
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const [propAngle, setPropAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { propScale, frameScale, styleAccent, batteryColor } = getVisualParams(spec);

  // Animate propellers
  useEffect(() => {
    if (reducedMotion) return;
    let last = performance.now();
    const speed = spec.style === "race" ? 8 : spec.style === "freestyle" ? 6 : 4;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPropAngle(prev => (prev + speed * 360 * dt) % 360);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [spec.style, reducedMotion]);

  // Drag to rotate
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rx: rotation.x, ry: rotation.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [rotation]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation({
      x: Math.max(-60, Math.min(10, dragStart.current.rx + dy * 0.35)),
      y: dragStart.current.ry + dx * 0.5,
    });
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // 3D → 2D projection
  const project = useCallback((x: number, y: number, z: number): [number, number, number] => {
    const cx = Math.cos((rotation.y * Math.PI) / 180);
    const sx = Math.sin((rotation.y * Math.PI) / 180);
    const cy = Math.cos((rotation.x * Math.PI) / 180);
    const sy = Math.sin((rotation.x * Math.PI) / 180);

    // Rotate around Y axis (azimuth)
    const x1 = x * cx - z * sx;
    const z1 = x * sx + z * cx;
    // Rotate around X axis (elevation)
    const y2 = y * cy - z1 * sy;
    const z2 = y * sy + z1 * cy;

    // Perspective divide
    const fov = 500;
    const depth = fov + z2;
    const px = (x1 * fov) / depth;
    const py = (y2 * fov) / depth;
    return [px, py, z2]; // z2 for depth sorting
  }, [rotation]);

  const compatC = compatColor(overallLevel);
  const glowColor = isHovered ? styleAccent : compatC;

  // ── Frame arm positions (4 arms at 45°) ────────────────
  const armLen = 80 * frameScale;
  const armAngles = [45, 135, 225, 315]; // degrees
  const motorPositions = armAngles.map(a => {
    const rad = (a * Math.PI) / 180;
    return { x: Math.cos(rad) * armLen, y: 0, z: Math.sin(rad) * armLen, angle: a };
  });

  // Battery height
  const batH = 12 * (spec.batteryMah ? Math.sqrt(spec.batteryMah / 1300) : 1);

  const viewSize = 280;
  const cx = viewSize / 2;
  const cy = viewSize / 2 - 10;

  return (
    <svg
      ref={canvasRef}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      width="100%"
      style={{ aspectRatio: "1", cursor: isDragging ? "grabbing" : "grab", touchAction: "none", maxHeight: 320 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <defs>
        {/* Glow filter */}
        <filter id="dv-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="dv-softglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Shadow */}
        <radialGradient id="dv-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* Prop gradient */}
        <radialGradient id="dv-propgrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={styleAccent} stopOpacity="0.6" />
          <stop offset="100%" stopColor={styleAccent} stopOpacity="0" />
        </radialGradient>
        {/* Frame gradient */}
        <linearGradient id="dv-framegrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a3545" />
          <stop offset="100%" stopColor="#141a22" />
        </linearGradient>
        <linearGradient id="dv-armgrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e2a38" />
          <stop offset="50%" stopColor="#2a3a50" />
          <stop offset="100%" stopColor="#1e2a38" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={cx} cy={cy + 85} rx={60 * frameScale} ry={10} fill="url(#dv-shadow)" />

      {/* ── Draw scene ── */}
      <g transform={`translate(${cx} ${cy})`}>

        {/* Arms */}
        {motorPositions.map((m, i) => {
          const [px, py] = project(m.x, m.y, m.z);
          const [ox, oy] = project(0, 0, 0);
          return (
            <line key={`arm-${i}`}
              x1={ox} y1={oy} x2={px} y2={py}
              stroke="url(#dv-armgrad)" strokeWidth={5 * frameScale}
              strokeLinecap="round"
            />
          );
        })}

        {/* Battery pack */}
        {(() => {
          const [bx, by] = project(0, -batH / 2, 0);
          const [bx2, by2] = project(22 * frameScale, -batH / 2, 0);
          const batW = Math.abs(bx2 - bx) * 2;
          return (
            <g>
              <rect
                x={bx - batW / 2} y={by - batH * 0.6}
                width={batW} height={batH * 1.2}
                rx={4} fill={batteryColor} fillOpacity={0.18}
                stroke={batteryColor} strokeWidth={1}
              />
              <text x={bx} y={by + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="6" fill={batteryColor} fontFamily="monospace" opacity={0.9}
              >
                {spec.batteryS}S
              </text>
            </g>
          );
        })()}

        {/* FC / Stack (center) */}
        {(() => {
          const [fx, fy] = project(0, -2, 0);
          const fSize = 18 * frameScale;
          return (
            <g filter="url(#dv-glow)">
              <rect
                x={fx - fSize / 2} y={fy - fSize / 2}
                width={fSize} height={fSize}
                rx={3} fill="#141a22" stroke={glowColor} strokeWidth={1.2}
                strokeOpacity={0.8}
              />
              {/* IC chips */}
              {[[-4, -4], [4, -4], [-4, 4], [4, 4]].map(([dx, dy], i) => (
                <rect key={i}
                  x={fx + dx * frameScale - 2} y={fy + dy * frameScale - 2}
                  width={4} height={4}
                  rx={0.5} fill={glowColor} fillOpacity={0.5}
                />
              ))}
              <text x={fx} y={fy + fSize / 2 + 7}
                textAnchor="middle" fontSize="5.5"
                fill="#6b7a90" fontFamily="monospace"
              >
                FC
              </text>
            </g>
          );
        })()}

        {/* Camera mount (front) */}
        {(() => {
          const [camX, camY] = project(0, -6, -30 * frameScale);
          return (
            <g filter="url(#dv-glow)">
              {/* Camera tilt bracket */}
              <rect x={camX - 9} y={camY - 7} width={18} height={14}
                rx={2} fill="#0f1318" stroke="#00aaff" strokeWidth={1}
                strokeOpacity={0.7}
              />
              {/* Lens */}
              <circle cx={camX} cy={camY} r={5}
                fill="#001a2a" stroke="#00aaff" strokeWidth={1.2}
                strokeOpacity={0.9}
              />
              <circle cx={camX} cy={camY} r={2.5}
                fill="#00aaff" fillOpacity={0.25}
              />
              {/* Glare */}
              <circle cx={camX - 1.5} cy={camY - 1.5} r={1}
                fill="white" fillOpacity={0.5}
              />
            </g>
          );
        })()}

        {/* Props + Motors */}
        {motorPositions.map((m, i) => {
          const [mx, my, mz] = project(m.x, m.y, m.z);
          const propR = 38 * propScale * (500 / (500 + mz));
          const bladeAngleOffset = i % 2 === 0 ? propAngle : -propAngle;
          const motorH = 8;
          const [topX, topY] = project(m.x, -motorH, m.z);

          // Motor spin direction color
          const spinColor = i % 2 === 0 ? styleAccent : "#00d8ff";

          return (
            <g key={`motor-${i}`}>
              {/* Prop disc blur */}
              <circle cx={mx} cy={my} r={propR}
                fill={`url(#dv-propgrad)`} opacity={reducedMotion ? 0.1 : 0.25}
              />

              {/* Prop blades */}
              {Array.from({ length: spec.propBlades }).map((_, b) => {
                const a = bladeAngleOffset + (b * 360) / spec.propBlades;
                const rad = (a * Math.PI) / 180;
                const bx = mx + Math.cos(rad) * propR;
                const by2 = my + Math.sin(rad) * propR;
                const bxM = mx + Math.cos(rad) * (propR * 0.5);
                const byM = my + Math.sin(rad) * (propR * 0.5);
                const perp = rad + Math.PI / 2;
                const halfW = propR * 0.13;
                return (
                  <path key={b}
                    d={`M ${mx} ${my}
                        C ${bxM + Math.cos(perp) * halfW} ${byM + Math.sin(perp) * halfW},
                          ${bx + Math.cos(perp) * halfW * 0.5} ${by2 + Math.sin(perp) * halfW * 0.5},
                          ${bx} ${by2}
                        C ${bx - Math.cos(perp) * halfW * 0.5} ${by2 - Math.sin(perp) * halfW * 0.5},
                          ${bxM - Math.cos(perp) * halfW} ${byM - Math.sin(perp) * halfW},
                          ${mx} ${my}`}
                    fill={spinColor} fillOpacity={reducedMotion ? 0.6 : 0.4}
                    stroke={spinColor} strokeWidth={0.5} strokeOpacity={0.6}
                  />
                );
              })}

              {/* Motor body */}
              <circle cx={mx} cy={my} r={6 * frameScale * 0.9}
                fill="#1e2a38" stroke={spinColor} strokeWidth={1.5}
              />
              <circle cx={mx} cy={my} r={3 * frameScale * 0.9}
                fill={spinColor} fillOpacity={0.5}
              />

              {/* Motor stem */}
              <line x1={topX} y1={topY} x2={mx} y2={my}
                stroke="#2a3a50" strokeWidth={3 * frameScale}
              />
            </g>
          );
        })}

        {/* Frame center body */}
        {(() => {
          const [fx, fy] = project(0, 0, 0);
          const bodyW = 28 * frameScale;
          const bodyH = 32 * frameScale;
          return (
            <g filter="url(#dv-glow)">
              <ellipse cx={fx} cy={fy} rx={bodyW / 2} ry={bodyH / 2}
                fill="url(#dv-framegrad)"
                stroke={glowColor} strokeWidth={1}
                strokeOpacity={0.5}
              />
              {/* Center pattern */}
              <ellipse cx={fx} cy={fy} rx={bodyW / 4} ry={bodyH / 4}
                fill="none" stroke={glowColor} strokeWidth={0.5}
                strokeOpacity={0.3}
              />
            </g>
          );
        })()}

        {/* Compat indicator dot */}
        {(() => {
          const [ix, iy] = project(-30, -10, -20);
          return (
            <g filter="url(#dv-softglow)">
              <circle cx={ix} cy={iy} r={4}
                fill={compatC} fillOpacity={0.9}
              >
                {!reducedMotion && (
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          );
        })()}
      </g>

      {/* Labels overlay */}
      <text x={8} y={viewSize - 22} fontSize="8" fill="#3a4555" fontFamily="monospace">
        {spec.frameMm}mm · {spec.propIn}" · {spec.motorKV}KV · {spec.batteryS}S
      </text>
      <text x={8} y={viewSize - 11} fontSize="8" fill="#3a4555" fontFamily="monospace">
        {spec.weightG}g · {spec.style}
      </text>

      {/* Drag hint */}
      <text x={viewSize - 8} y={viewSize - 11} fontSize="8"
        fill="#3a4555" fontFamily="monospace" textAnchor="end"
      >
        drag to rotate
      </text>
    </svg>
  );
}
