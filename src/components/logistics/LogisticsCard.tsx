"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const LogisticsScene = dynamic(() => import("./LogisticsScene"), {
  ssr: false,
  loading: () => <div className="logi__loading" />,
});

const START = 1248;

/** 3D loading-dock scene with a live HUD fed by the scanner events. */
export default function LogisticsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scan, setScan] = useState<{ count: number; serial: number | null }>({ count: START, serial: null });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onScan = useCallback((serial: number) => setScan((s) => ({ count: s.count + 1, serial })), []);

  return (
    <figure className="logi glass-light reveal">
      <div ref={ref} className="logi__stage" role="img" aria-label="Animación 3D: un camión se descarga en una cinta, un operario escanea cada paquete con su tablet y los paquetes se apilan en un pallet para despacho.">
        <LogisticsScene onScan={onScan} active={active} reducedMotion={reduced} />
        <div className="logi__hud glass-light" aria-hidden="true">
          <span className="mono-s logi__live">
            <i /> En vivo · Muelle 2
          </span>
          <strong>{scan.count.toLocaleString("es")}</strong>
          <span className="mono-s muted">Paquetes trazados hoy</span>
        </div>
        {scan.serial && (
          <div className="logi__toast glass-light" key={scan.serial} aria-hidden="true">
            <span className="logi__check">✓</span>
            <span className="mono-s">#VL-{scan.serial} · escaneado</span>
          </div>
        )}
      </div>
      <figcaption>
        <span className="mono-s">Logística · trazabilidad en tiempo real</span>
        <span className="mono-s muted">Recepción → despacho</span>
      </figcaption>
    </figure>
  );
}
