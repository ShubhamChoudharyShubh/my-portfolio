"use client";

import { useEffect, useRef } from "react";

// Base64 encoded portrait image (embedded from Dot-Portrait.html)
const PORTRAIT_BASE64 =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAJYAlgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACikLBepoJAGTQAtFJkUZHrQAtFJkUZFAC0UhZQMkjFRz3NvawNc3M8cUKDc0jsFVR6kngUAS0VxcfxZ8Iais48NX665JbyGFlsSHXeOo39PyzXW2k73Nuk0kLRF1yUYcj2oG4uO5PRRRQIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiikoAWis3WNdsNHVBdXEaSSkiNXbGSBWJD42tdZvxo/hu5hupkUPc3G4GOFSOuRwT6duKdilFvVHWZpqyo2cHgHBPvXz/8V/2ktG8Jynw14C1K01vxAbkQ3W+YBIgOGG7oWB7DpXW+HviGdP8AB8XiDxzFaRC1+0gwXKNG4xksFJB/E/pSK9lK1z1OSSKNS8kiqoBJJOBiuCvvijLJqw0fQNCmujKreVdSkJCSDg+5H86+Hfi9/wAFI9Su/GFtYfDnw7p03h+1fy7qa/Zv35BOQhXoO2eQOvSvAce+2NeKsuxYdQMZ9ec5JqHVitjohhm9Wj9Z77Xp/BtsdgNf1jWJrqc+ddSb5FXe/PQfTpXz/4v+MXj/4heKdRs/JWwjjlEcMEcWVVB0DFvX14qo8wdgcA55PPJqN2LlB95yePXisliHJXsdccLCGrNiw+I3jTStWj1iz8S6kmpW8e1JzdP5ignH3c4/Cu7074peKdQsPKt9fuYX8v5n3bz6cFsj8q8tmZflCn7q5bHv6GtDTJWivoWyGGcAHkgDml7VvoHsVFXPpXwz8W9XvoIY4L1GlmJA81M5IwPmB6e3avRfhv4s8U6t43sLO41S6a2aMM7CXkA9OCa+bPDdwjMolBQJjdgnIzgc19AfBWaMXlxLHks8akAHgcZ/rXDi8TVhBuLO7CUKdSSuj9A/AvijT7rSoYrq+jjmOCwfI3H3rof+Ei0jY0p1CGJYxvZjIBtHrXzLFqMGnW6/vo/MAHyhwTnFOm8R6exKkqMEYbPFfLKpUvdM+jlhqbWh7RqXxM8HaHdm11fxVpen3IHMO+aR+efljXOK5zUP2kfCVncpBo8r6tI5ZZNQSH91DjPJbgEH+76V8ueJvFqJIVtwkSpzwSrEZ7dB+VYen6pLJHJdXAMhY7dqjGOm0fjz+VdcKCUeaTuY1cRCGkEfU/iz9pW3l1+bRPD5spGtmWP7VdKXjDADq+BkZPQc1veF/if4o8d6HBqd3r9xEhVQ0dvF5Ee/BJJJY8D6fhXxdrWqPbWpkiUmR2WIR9V2jOT+VN8Na3r2qNcW3h7VGge4j/e7JfLkU9Rg5P4V1LC04x5mrHL9frSlyxbsen/ELxdrnjHxrd3V1dXJfzXjB84xyMQMBVGeABgDHJOT1r0D4LG6N3cGGaTJYFmBOGHtXiulSSafcxtb3Msl3lWCnB3AgZA/H8+1epfCF8yX5ZjymQCe+elYxpqD0Wx3OpKpHcb+1lJBc/C2a3vb9bO0N5bvcsSRlFmVivsOeTiuY8R6Z4V0bwhDoOnfab6GwRjPeQ/u/Plc5LFT1UL0FZGQ6aV8Wf2aNPFjFeXfhLxdqlrcRTRqS1vt37yT2BEo64616PZeLfCtx4D1DwTe3v2a4ttB1eUwzJiaN0s5Cmxh0O5lHPcmvD/tZz2Zrpc81K/U59LaSC+trxHy0M43lR0U9x6cVT+KPi++0Pw4g0bXIrfVLuR4Y55Fy8TjGVBGef89K0fCfhr+39bk0p0jkYxs0UkmRvI9M9BjnP0rijFtd3MMMNvfKhYLsYhDkAgnn0FcVCMeezZ6UqicLxOHtfhv4g1W4WS+1a5klnj37mnaMHBAxgDArLvNN+IVjaSQtYS3Fmu4iJg7bD/CuMcfl+lel3GpW2kW4vrtniCkFJBiRU4Ixvwcg8e38qyJ/jLPp0r2Vxp9pJFJuYpAqNsHYknkE9OK9L2XM9Ikxbi7n//2Q==";

export function DotPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const N = 210;
    const S = 840;
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
      const w = cv!.clientWidth;
      cv!.width = w * dpr;
      cv!.height = w * dpr;
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
      animationId = requestAnimationFrame(frame);
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size();
      moving = true;
    };
    window.addEventListener("resize", onResize);

    // Load image
    const img = new Image();
    img.onload = () => start(img);
    img.src = PORTRAIT_BASE64;

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointerleave", onPointerLeave);
      cv.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square rounded-2xl touch-none cursor-crosshair"
      style={{ background: "transparent" }}
    />
  );
}
