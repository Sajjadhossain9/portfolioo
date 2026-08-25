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
      const scale = Math.min(width, height) * 0.15;

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
      context.lineWidth = lineWidth * ((a.perspective + b.perspective) / 2) * 1.35;
      context.stroke();
    };

    const face3D = (points, yaw, pitch, roll, color) => {
      const projected = points.map((point) => project(point, yaw, pitch, roll));
      context.beginPath();
      context.moveTo(projected[0].x, projected[0].y);
      projected.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.closePath();
      context.fillStyle = color;
      context.fill();
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
      context.strokeStyle = "rgba(105, 214, 255, .24)";
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
      context.shadowColor = "rgba(80, 220, 255, .65)";
      context.shadowBlur = 7;

      rings[0].forEach((point, index) => {
        const next = rings[0][(index + 1) % segmentCount];
        face3D(
          [nose, point, next],
          yaw,
          pitch,
          roll,
          index % 2 === 0 ? "rgba(255, 73, 185, .105)" : "rgba(77, 226, 255, .085)",
        );
      });

      for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex += 1) {
        rings[ringIndex].forEach((point, index) => {
          const next = rings[ringIndex][(index + 1) % segmentCount];
          const below = rings[ringIndex + 1][index];
          const belowNext = rings[ringIndex + 1][(index + 1) % segmentCount];
          face3D(
            [point, next, belowNext, below],
            yaw,
            pitch,
            roll,
            index % 3 === 0 ? "rgba(102, 92, 255, .075)" : "rgba(67, 223, 255, .042)",
          );
        });
      }

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
              ? `rgba(101, 239, 255, ${Math.min(1, alpha + 0.2)})`
              : `rgba(182, 126, 255, ${Math.min(1, alpha + 0.2)})`,
            ringIndex === 1 ? 1.8 : 1.3,
          );
        });
      });

      rings[0].forEach((point, index) => {
        if (index % 2 === 0) {
          line3D(nose, point, yaw, pitch, roll, "rgba(255, 103, 201, .96)", 1.7);
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
            index % 4 === 0 ? "rgba(255, 196, 79, .9)" : "rgba(91, 236, 255, .82)",
            1.35,
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
        line3D(rootTop, outer, yaw, pitch, roll, color, 1.6);
        line3D(outer, rootBottom, yaw, pitch, roll, color, 1.6);
        line3D(rootBottom, rootTop, yaw, pitch, roll, "rgba(98, 225, 255, .45)", 1);
      });

      line3D(nose, engine, yaw, pitch, roll, "rgba(244, 251, 255, .34)", 1.1);

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
      canvas.parentElement.style.setProperty("--model-ry", `${pointer.targetX * 17}deg`);
      canvas.parentElement.style.setProperty("--model-rx", `${pointer.targetY * -10 - 4}deg`);
      if (reducedMotion) render(0);
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      canvas.parentElement.style.setProperty("--model-ry", "9deg");
      canvas.parentElement.style.setProperty("--model-rx", "-4deg");
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
      <div className="scene-model-wrap" aria-hidden="true">
        <svg className="scene-model" viewBox="0 0 320 520">
          <defs>
            <linearGradient id="craftFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4fe3ff" stopOpacity=".2" />
              <stop offset=".46" stopColor="#7f6dff" stopOpacity=".1" />
              <stop offset="1" stopColor="#ff58bd" stopOpacity=".2" />
            </linearGradient>
            <linearGradient id="craftLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff69c5" />
              <stop offset=".38" stopColor="#67e7ff" />
              <stop offset=".7" stopColor="#9d7bff" />
              <stop offset="1" stopColor="#ffb14b" />
            </linearGradient>
            <filter id="craftGlow" x="-80%" y="-40%" width="260%" height="190%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="craft-glow" filter="url(#craftGlow)">
            <path className="craft-body-fill" d="M160 24 112 132 106 346 129 411 191 411 214 346 208 132Z" />
            <path className="craft-outline" d="M160 24 112 132 106 346 129 411 191 411 214 346 208 132Z" />
            <path className="craft-center" d="M160 24V440M112 132 160 166 208 132M106 346 160 316 214 346M129 411 160 382 191 411" />
            <path className="craft-facet cyan" d="M160 24 112 132 160 166ZM160 166 106 346 160 316ZM160 316 129 411 160 382Z" />
            <path className="craft-facet violet" d="M160 24 208 132 160 166ZM160 166 214 346 160 316ZM160 316 191 411 160 382Z" />
            <ellipse className="craft-ring ring-one" cx="160" cy="134" rx="49" ry="18" />
            <ellipse className="craft-ring ring-two" cx="160" cy="235" rx="54" ry="20" />
            <ellipse className="craft-ring ring-three" cx="160" cy="345" rx="53" ry="19" />
            <path className="craft-fin fin-left" d="M108 294 41 391 127 367Z" />
            <path className="craft-fin fin-right" d="M212 294 279 391 193 367Z" />
            <path className="craft-engine" d="M130 411 142 447H178L190 411M142 447 160 472 178 447" />
            <path className="craft-thrust thrust-one" d="M145 457 132 507" />
            <path className="craft-thrust thrust-two" d="M160 470 160 519" />
            <path className="craft-thrust thrust-three" d="M175 457 190 507" />
            <circle className="craft-node node-one" cx="160" cy="24" r="4" />
            <circle className="craft-node node-two" cx="106" cy="346" r="3" />
            <circle className="craft-node node-three" cx="214" cy="346" r="3" />
          </g>
        </svg>
      </div>
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
