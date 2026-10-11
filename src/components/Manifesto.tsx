"use client";

import { useEffect, useRef } from "react";

type Word = { text: string; em?: boolean };

const TEXT: Word[] = [
  ..."Identificamos el origen de cada problema y construimos el".split(" ").map((text) => ({ text })),
  { text: "cauce", em: true },
  ..."para que la tecnología fluya sin fricción.".split(" ").map((text) => ({ text })),
];

/** Large statement whose words light up as the section scrolls through the viewport. */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const lit = progress * words.length * 1.1;
      words.forEach((w, i) => w.style.setProperty("--lit", String(Math.min(Math.max(lit - i, 0), 1))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <p ref={ref} className="manifesto__text">
      {TEXT.map((w, i) => (
        <span key={i} data-w className={w.em ? "em" : undefined}>
          {w.text}{" "}
        </span>
      ))}
    </p>
  );
}
