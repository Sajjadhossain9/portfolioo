import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

function rotatePoint(point, yaw, pitch, roll) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const cz = Math.cos(roll);
  const sz = Math.sin(roll);

  const x1 = point.x * cy - point.z * sy;
  const z1 = point.x * sy + point.z * cy;
  const y1 = point.y;
  const y2 = y1 * cx - z1 * sx;
  const z2 = y1 * sx + z1 * cx;

  return {
    x: x1 * cz - y2 * sz,
    y: x1 * sz + y2 * cz,
    z: z2,
  };
}

function seededValue(index, offset = 0) {
  return Math.abs(Math.sin(index * 9283.17 + offset * 77.31) * 43758.5453) % 1;
}

export default function FlightScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const stars = Array.from({ length: 86 }, (_, index) => ({
      x: seededValue(index, 1),
      y: seededValue(index, 2),
      size: 0.45 + seededValue(index, 3) * 1.55,
      phase: seededValue(index, 4) * TAU,
      color: index % 7 === 0 ? "violet" : index % 11 === 0 ? "pink" : "cyan",
    }));
    let width = 0;
    let height = 0;
    let animationFrame;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const project = (point, yaw, pitch, roll) => {
      const rotated = rotatePoint(point, yaw, pitch, roll);
      const camera = 6.8;
      const depth = Math.max(2.2, camera + rotated.z);
      const perspective = camera / depth;
      const scale = Math.min(width, height) * 0.128;

      return {
        x: width * 0.51 + rotated.x * scale * perspective,
        y: height * 0.49 + rotated.y * scale * perspective,
        z: rotated.z,
        perspective,
      };
    };

    const line3D = (from, to, yaw, pitch, roll, color, lineWidth = 1) => {
      const a = project(from, yaw, pitch, roll);
      const b = project(to, yaw, pitch, roll);
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.strokeStyle = color;
      context.lineWidth = lineWidth * ((a.perspective + b.perspective) / 2);
      context.stroke();
    };

    const drawStars = (time) => {
      stars.forEach((star, index) => {
        const pulse = 0.3 + (Math.sin(time * 0.0012 + star.phase) + 1) * 0.25;
        const drift = (time * (0.001 + (index % 3) * 0.00025)) % (height + 60);
        const y = (star.y * height + drift * 0.08) % height;
        const colors = {
          cyan: `rgba(88, 231, 255, ${pulse})`,
          violet: `rgba(151, 108, 255, ${pulse * 0.9})`,
          pink: `rgba(255, 83, 190, ${pulse * 0.85})`,
        };

        context.beginPath();
        context.arc(star.x * width, y, star.size, 0, TAU);
        context.fillStyle = colors[star.color];
        context.fill();
      });
    };

    const drawGrid = (yaw, pitch, roll) => {
      for (let value = -4; value <= 4; value += 1) {
        const major = value === 0;
        line3D(
          { x: -4, y: 2.45, z: value },
          { x: 4, y: 2.45, z: value },
          yaw,
          pitch,
          roll,
          major ? "rgba(93, 229, 255, .24)" : "rgba(93, 229, 255, .075)",
          major ? 1.2 : 0.8,
        );
        line3D(
          { x: value, y: 2.45, z: -4 },
          { x: value, y: 2.45, z: 4 },
          yaw,
          pitch,
          roll,
          major ? "rgba(158, 105, 255, .2)" : "rgba(158, 105, 255, .065)",
          major ? 1.2 : 0.8,
        );
      }
    };

    const drawOrbit = (time) => {
      const radius = Math.min(width, height) * 0.41;
      const centerX = width * 0.51;
      const centerY = height * 0.49;
      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.2);
      context.scale(1, 0.42);
      context.beginPath();
      context.arc(0, 0, radius, 0, TAU);
      context.strokeStyle = "rgba(105, 214, 255, .13)";
      context.setLineDash([5, 10]);
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);
      const angle = time * 0.00045;
      const dotX = Math.cos(angle) * radius;
      const dotY = Math.sin(angle) * radius;
      context.beginPath();
      context.arc(dotX, dotY, 5, 0, TAU);
      context.fillStyle = "rgba(255, 174, 69, .95)";
      context.shadowColor = "#ffae45";
      context.shadowBlur = 18;
      context.fill();
      context.restore();
      context.shadowBlur = 0;
    };

    const drawCraft = (time, yaw, pitch, roll) => {
      const segmentCount = 14;
      const rings = [
        { y: -1.15, radius: 0.48 },
        { y: 0.2, radius: 0.56 },
        { y: 1.2, radius: 0.5 },
        { y: 1.55, radius: 0.34 },
      ].map((ring) => Array.from({ length: segmentCount }, (_, index) => {
        const angle = (index / segmentCount) * TAU;
        return {
          x: Math.cos(angle) * ring.radius,
          y: ring.y,
          z: Math.sin(angle) * ring.radius,
        };
      }));
      const nose = { x: 0, y: -2.05, z: 0 };
      const engine = { x: 0, y: 1.92, z: 0 };

      context.save();
      context.globalCompositeOperation = "lighter";
      rings.forEach((ring, ringIndex) => {
        ring.forEach((point, index) => {
          const next = ring[(index + 1) % segmentCount];
          const alpha = 0.24 + (index / segmentCount) * 0.38;
          line3D(
            point,
            next,
            yaw,
            pitch,
            roll,
            ringIndex % 2 === 0
              ? `rgba(77, 226, 255, ${alpha})`
              : `rgba(160, 102, 255, ${alpha})`,
            ringIndex === 1 ? 1.5 : 1,
          );
        });
      });

      rings[0].forEach((point, index) => {
        if (index % 2 === 0) {
          line3D(nose, point, yaw, pitch, roll, "rgba(255, 95, 194, .72)", 1.35);
        }
      });

      for (let index = 0; index < segmentCount; index += 2) {
        for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex += 1) {
          line3D(
            rings[ringIndex][index],
            rings[ringIndex + 1][index],
            yaw,
            pitch,
            roll,
            index % 4 === 0 ? "rgba(255, 196, 79, .6)" : "rgba(80, 225, 255, .58)",
            1.1,
          );
        }
        line3D(rings[3][index], engine, yaw, pitch, roll, "rgba(153, 101, 255, .55)", 1);
      }

      [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle, index) => {
        const side = { x: Math.cos(angle), z: Math.sin(angle) };
        const rootTop = { x: side.x * 0.42, y: 0.72, z: side.z * 0.42 };
        const rootBottom = { x: side.x * 0.36, y: 1.53, z: side.z * 0.36 };
        const outer = { x: side.x * 1.13, y: 1.43, z: side.z * 1.13 };
        const color = index % 2 === 0 ? "rgba(255, 84, 190, .68)" : "rgba(255, 178, 67, .7)";
        line3D(rootTop, outer, yaw, pitch, roll, color, 1.2);
        line3D(outer, rootBottom, yaw, pitch, roll, color, 1.2);
        line3D(rootBottom, rootTop, yaw, pitch, roll, "rgba(98, 225, 255, .45)", 1);
      });

      const nosePoint = project(nose, yaw, pitch, roll);
      context.beginPath();
      context.arc(nosePoint.x, nosePoint.y, 3.5, 0, TAU);
      context.fillStyle = "#ff5fc2";
      context.shadowColor = "#ff5fc2";
      context.shadowBlur = 16;
      context.fill();
      context.shadowBlur = 0;
      context.restore();

      for (let index = 0; index < 16; index += 1) {
        const phase = ((time * 0.0014 + index * 0.17) % 1);
        const spread = (seededValue(index, 8) - 0.5) * phase * 0.9;
        const exhaustPoint = project(
          { x: spread, y: 1.82 + phase * 2.25, z: (seededValue(index, 9) - 0.5) * phase },
          yaw,
          pitch,
          roll,
        );
        context.beginPath();
        context.arc(exhaustPoint.x, exhaustPoint.y, 1.2 + (1 - phase) * 1.5, 0, TAU);
        context.fillStyle = index % 3 === 0
          ? `rgba(255, 89, 191, ${0.5 * (1 - phase)})`
          : `rgba(79, 226, 255, ${0.65 * (1 - phase)})`;
        context.fill();
      }
    };

    const render = (time = 0) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      context.clearRect(0, 0, width, height);
      drawStars(time);

      const yaw = time * 0.00018 + pointer.x * 0.72 + 0.35;
      const pitch = pointer.y * 0.32 - 0.08;
      const roll = -0.13 + pointer.x * 0.08;
      drawOrbit(time);
      drawGrid(yaw * 0.45, pitch + 0.08, roll * 0.2);
      drawCraft(time, yaw, pitch, roll);

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (reducedMotion) render(0);
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      if (reducedMotion) render(0);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) render(0);
    });
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", resetPointer);
    resize();
    render(0);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div
      className="flight-scene"
      role="img"
      aria-label="Interactive three-dimensional wireframe launch vehicle and avionics telemetry display"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="scene-vignette" aria-hidden="true" />
      <div className="scene-brackets" aria-hidden="true" />
      <span className="scene-tag scene-tag-top">3D FLIGHT OBJECT / LIVE</span>
      <span className="scene-tag scene-tag-side">X +12.8<br />Y -04.2<br />Z +38.1</span>
      <span className="scene-tag scene-tag-bottom">MOVE POINTER TO ORBIT</span>
      <div className="scene-profile">
        <img
          src="https://avatars.githubusercontent.com/u/219995643?v=4"
          alt="Md. Sajjad Hossain"
          width="128"
          height="128"
          loading="eager"
          decoding="async"
        />
        <span><i /> OPERATOR 04</span>
      </div>
      <div className="scene-spectrum" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
    </div>
  );
}
