"use client";

import ShaderCanvas from "./ShaderCanvas";
import { heroFrag } from "@/shaders/hero";
import { contoursFrag } from "@/shaders/contours";
import { auraFrag } from "@/shaders/aura";

const DARK = { uLight: 0, uBase: [14 / 255, 13 / 255, 11 / 255] as [number, number, number] };
const LIGHT = { uLight: 1, uBase: [243 / 255, 240 / 255, 233 / 255] as [number, number, number] };
const PAPER = { uLight: 1, uBase: [251 / 255, 250 / 255, 246 / 255] as [number, number, number] };

export function HeroShader() {
  return <ShaderCanvas frag={heroFrag} className="shader" maxDpr={1.25} />;
}

export function ContourShader() {
  return <ShaderCanvas frag={contoursFrag} className="shader" maxDpr={1.25} />;
}

export function AuraShader({ tone = "dark" }: { tone?: "dark" | "light" | "paper" }) {
  const uniforms = tone === "dark" ? DARK : tone === "light" ? LIGHT : PAPER;
  return <ShaderCanvas frag={auraFrag} uniforms={uniforms} className="shader" maxDpr={1} />;
}
