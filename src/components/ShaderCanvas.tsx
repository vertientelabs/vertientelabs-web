"use client";

import { useEffect, useRef } from "react";

type UniformValue = number | [number, number] | [number, number, number];

type Props = {
  frag: string;
  uniforms?: Record<string, UniformValue>;
  className?: string;
  /** Upper bound for device pixel ratio; fragment-heavy shaders want less. */
  maxDpr?: number;
};

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

/**
 * Full-bleed WebGL2 canvas that renders one fragment shader.
 * Pauses when off screen, eases the pointer, and renders a single still frame
 * when the visitor prefers reduced motion.
 */
export default function ShaderCanvas({ frag, uniforms, className, maxDpr = 1.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef(uniforms);

  useEffect(() => {
    uniformsRef.current = uniforms;
  }, [uniforms]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      canvas.classList.add("is-fallback");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      canvas.classList.add("is-fallback");
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const loc = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = loc("uRes"), uTime = loc("uTime"), uMouse = loc("uMouse");
    const uMouseActive = loc("uMouseActive"), uIntro = loc("uIntro"), uScroll = loc("uScroll");
    const customLocs = new Map<string, WebGLUniformLocation | null>();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, a: 0, ta: 0 };
    let visible = true;
    let raf = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduced) draw(start + 6000);
    };

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.a += (mouse.ta - mouse.a) * 0.04;

      const rect = canvas.getBoundingClientRect();
      const scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 12 : elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseActive, mouse.a);
      gl.uniform1f(uIntro, reduced ? 1 : Math.min(elapsed / 2.4, 1));
      gl.uniform1f(uScroll, scroll);

      const custom = uniformsRef.current;
      if (custom) {
        for (const [name, value] of Object.entries(custom)) {
          if (!customLocs.has(name)) customLocs.set(name, loc(name));
          const l = customLocs.get(name)!;
          if (typeof value === "number") gl.uniform1f(l, value);
          else if (value.length === 2) gl.uniform2f(l, value[0], value[1]);
          else gl.uniform3f(l, value[0], value[1], value[2]);
        }
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      mouse.tx = x;
      mouse.ty = y;
      mouse.ta = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0;
    };
    const onLeave = () => (mouse.ta = 0);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [frag, maxDpr]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
