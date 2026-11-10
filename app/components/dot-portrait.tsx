"use client";

import { useEffect, useRef } from "react";

// Extracted from Dot-Portrait.html — the full embedded JPEG of Shubham's portrait
// Loaded as a data URI so no external request is needed
const PORTRAIT_SRC = "/shubham.png"; // Uses the existing local portrait image

export function DotPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!cv || !wrapper) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const N = 210; // sampling grid
    const S = 840; // logical canvas size
    let dots: Array<{
      x: number;
      y: number;
      r: number;
      c: string;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    }> = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mx = -999,
      my = -999,
      active = false,
      burst = 0,
      moving = true;
    let animationId: number;
    let isDestroyed = false;

    function size() {
      // Use the wrapper's width to avoid 0-size canvas issues
      const w = wrapper!.clientWidth || 260;
      cv!.width = Math.round(w * dpr);
      cv!.height = Math.round(w * dpr);
      // Keep CSS size square
      cv!.style.width = w + "px";
      cv!.style.height = w + "px";
    }

    function build(img: HTMLImageElement) {
      const o = document.createElement("canvas");
      o.width = o.height = N;
      const x = o.getContext("2d")!;
      x.drawImage(img, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N).data;
      dots = [];
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const k = (j * N + i) * 4;
          const r = d[k],
            g = d[k + 1],
            b = d[k + 2];
          const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (l > 0.97) continue;
          dots.push({
            x: ((i + 0.5) / N) * S,
            y: ((j + 0.5) / N) * S,
            r: (0.42 + 0.58 * Math.pow(1 - l, 0.7)) * (S / N) * 0.58,
            c: `rgb(${r},${g},${b})`,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    function pos(e: PointerEvent) {
      const b = cv!.getBoundingClientRect();
      mx = ((e.clientX - b.left) / b.width) * S;
      my = ((e.clientY - b.top) / b.height) * S;
    }

    const onPointerMove = (e: PointerEvent) => {
      pos(e);
      active = true;
    };
    const onPointerDown = (e: PointerEvent) => {
      pos(e);
      active = true;
      burst = 1;
    };
    const onPointerLeave = () => {
      active = false;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") active = false;
    };

    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointerleave", onPointerLeave);
    cv.addEventListener("pointerup", onPointerUp);

    const R = 95;

    function frame() {
      if (isDestroyed) return;
      if (!active && !moving && !burst) {
        animationId = requestAnimationFrame(frame);
        return;
      }
      const s = cv!.width / S;
      let any = false;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      ctx!.setTransform(s, 0, 0, s, 0, 0);
      const rad = burst ? R * 1.9 : R;
      const pw = burst ? 14 : 5;
      for (const p of dots) {
        if (active || burst) {
          const ax = p.x + p.ox - mx,
            ay = p.y + p.oy - my,
            d2 = ax * ax + ay * ay;
          if (d2 < rad * rad) {
            const d = Math.sqrt(d2) || 1;
            const f = Math.pow(1 - d / rad, 2) * pw;
            p.vx += (ax / d) * f + (Math.random() - 0.5) * f * 0.6;
            p.vy += (ay / d) * f + (Math.random() - 0.5) * f * 0.6;
          }
        }
        p.vx += -p.ox * 0.045;
        p.vy += -p.oy * 0.045;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.ox += p.vx;
        p.oy += p.vy;
        if (
          Math.abs(p.vx) > 0.02 ||
          Math.abs(p.vy) > 0.02 ||
          Math.abs(p.ox) > 0.1 ||
          Math.abs(p.oy) > 0.1
        )
          any = true;
        else {
          p.ox = p.oy = p.vx = p.vy = 0;
        }
        const dd = Math.hypot(p.ox, p.oy);
        const k = 1 - Math.min(dd / 90, 0.45);
        ctx!.fillStyle = p.c;
        ctx!.beginPath();
        ctx!.arc(p.x + p.ox, p.y + p.oy, Math.max(p.r * k, 0.2), 0, 6.2832);
        ctx!.fill();
      }
      moving = any;
      burst = 0;
      animationId = requestAnimationFrame(frame);
    }

    function start(img: HTMLImageElement) {
      size();
      build(img);
      moving = true;
      animationId = requestAnimationFrame(frame);
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size();
      moving = true;
    };
    window.addEventListener("resize", onResize);

    // Use ResizeObserver to handle when wrapper changes size
    const ro = new ResizeObserver(() => {
      onResize();
    });
    ro.observe(wrapper);

    // Load image — use existing public portrait or fallback
    const img = new Image();
    img.onload = () => start(img);
    img.onerror = () => {
      // Fallback: draw placeholder dots in a gradient pattern
      dots = [];
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const dist = Math.hypot(i - N / 2, j - N / 2) / (N / 2);
          if (dist > 0.9 || Math.random() > 0.4) continue;
          const brightness = 1 - dist;
          const gray = Math.round(brightness * 180 + 30);
          dots.push({
            x: ((i + 0.5) / N) * S,
            y: ((j + 0.5) / N) * S,
            r: (0.42 + 0.58 * Math.pow(brightness, 0.7)) * (S / N) * 0.58,
            c: `rgb(${gray},${gray},${gray})`,
            ox: 0, oy: 0, vx: 0, vy: 0,
          });
        }
      }
      size();
      moving = true;
      animationId = requestAnimationFrame(frame);
    };
    img.src = PORTRAIT_SRC;

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      ro.disconnect();
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointerleave", onPointerLeave);
      cv.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full aspect-square">
      <canvas
        ref={canvasRef}
        className="touch-none cursor-crosshair rounded-2xl"
        style={{ display: "block" }}
      />
    </div>
  );
}
