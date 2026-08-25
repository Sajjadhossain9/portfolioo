import { useEffect, useState } from "react";
import FlightScene from "./FlightScene";
import Footer from "./components/Footer";
import Header from "./components/Header";

const capabilityGroups = [
  {
    code: "01",
    title: "Embedded systems",
    detail: "Arduino, ESP32, sensor integration, calibration and embedded C/Python.",
    status: "APPLIED",
  },
  {
    code: "02",
    title: "Flight interfaces",
    detail: "Ground-control UI, telemetry thinking and operator-focused system design.",
    status: "BUILDING",
  },
  {
    code: "03",
    title: "Circuits & PCB",
    detail: "Circuit integration, micro-soldering, PCB design, printing and testing.",
    status: "HANDS-ON",
  },
  {
    code: "04",
    title: "Software systems",
    detail: "Responsive web development, UI design, data reporting and technical tools.",
    status: "DEPLOYED",
  },
];

const missions = [
  {
    id: "Avionics",
    number: "M-01",
    title: "Avionics Systems",
    subtitle: "Flight systems",
    description:
      "Developing the electronics layer of a student grade avionics system: controller integration, navigation, component soldering, Ground Control Station UI and parachute deployment testing.",
    tags: ["MCU / MPU", "Navigation", "GCS UI", "Recovery"],
    metric: "FLIGHT-CRITICAL",
    signal: "87",
  },
  {
    id: "engine",
    number: "M-02",
    title: "Engine health monitor",
    subtitle: "20cc aircraft engine / Predictive maintenance",
    description:
      "Building an ESP32-based monitoring system using Hall-effect and supporting sensors, with responsibility across selection, integration, calibration, firmware and monitoring UI.",
    tags: ["ESP32", "Hall sensor", "Calibration", "Monitoring UI"],
    metric: "SENSE → PREDICT",
    signal: "74",
  },
  {
    id: "radar",
    number: "M-03",
    title: "Frequency-hopping radar",
    subtitle: "Undergraduate research / Signal systems",
    description:
      "Exploring radar system design and simulation with an emphasis on frequency-hopping techniques, resilient operation and system-level implementation.",
    tags: ["Radar", "Simulation", "Frequency hopping", "Research"],
    metric: "RESILIENT RF",
    signal: "92",
  },
  {
    id: "drone",
    number: "M-04",
    title: "Drone control interface",
    subtitle: "AAUB Drone Club / Executive, Software",
    description:
      "Creating UI/UX concepts and operator interaction flows for an aerial surveillance drone, connecting vehicle data with a clear ground-control experience.",
    tags: ["Surveillance", "Ground control", "UI / UX", "Telemetry"],
    metric: "HUMAN IN LOOP",
    signal: "81",
  },
];

const experience = [
  {
    period: "PRESENT",
    role: "Executive Member — Software",
    place: "AAUB DRONE CLUB",
    text: "Control-interface and UI/UX concepts for an aerial surveillance platform.",
  },
  {
    period: "COMPETITION",
    role: "Team Lead",
    place: "TEAM AVYBARQ / IEEE CASS SDC",
    text: "Coordinating a multidisciplinary team across circuits, system design and technical delivery.",
  },
  {
    period: "COMMUNITY",
    role: "Volunteer & Organizer",
    place: "RCY · VFB · BADHON",
    text: "Humanitarian work, volunteer coordination, fundraising and event operations.",
  },
];


function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

function SectionHeading({ index, label, title, copy }) {
  return (
    <header className="section-heading reveal">
      <div className="section-kicker">
        <span>{index}</span>
        <i />
        <small>{label}</small>
      </div>
      <div>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </header>
  );
}

function handleTilt(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const element = event.currentTarget;
  const bounds = element.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  element.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
  element.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
  element.style.setProperty("--glow-x", `${x * 100}%`);
  element.style.setProperty("--glow-y", `${y * 100}%`);
}

function resetTilt(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
  event.currentTarget.style.setProperty("--glow-x", "50%");
  event.currentTarget.style.setProperty("--glow-y", "50%");
}

export default function App() {
  const [time, setTime] = useState("--:--:--");
  const [activeMission, setActiveMission] = useState(missions[0]);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const handlePointerGlow = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerGlow, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerGlow);
  }, []);

  return (
    <main>
      <a className="skip-link" href="#profile">Skip to portfolio content</a>
      <div className="ambient-spectrum" aria-hidden="true">
        <i className="ambient-orb orb-cyan" />
        <i className="ambient-orb orb-violet" />
        <i className="ambient-orb orb-magenta" />
        <i className="pointer-aura" />
      </div>
      <Header />

      <section className="hero shell" id="top">
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy">
          <div className="status-row">
            <span className="eyebrow"><i /> Mission profile / 04</span>
            <span className="nominal">SYSTEMS NOMINAL</span>
          </div>

          <h1>
            Full-stack web developer with a keen interest in
            <span> electronics and embedded systems for aviation.</span>
          </h1>

          <p>
            I am an Avionics Engineering student and full-stack web developer working
            across electronics, embedded systems, circuit design, and software. I enjoy
            turning multidisciplinary engineering ideas into practical, reliable systems.
          </p>

          <div className="actions">
            <a className="button primary" href="#missions">
              Explore missions <Arrow />
            </a>
            <a
              className="button secondary"
              href="https://github.com/Sajjadhossain9"
              target="_blank"
              rel="noreferrer"
            >
              GitHub telemetry
            </a>
            <a
              className="button secondary cv-download"
              href={`${import.meta.env.BASE_URL}Sajjad-Hossain-CV-Redacted.pdf`}
              download="Md-Sajjad-Hossain-CV.pdf"
            >
              Download CV <Arrow />
            </a>
          </div>

          <div className="telemetry">
            <div><span>LOC</span><strong>Lalmonirhat, BD</strong></div>
            <div><span>FOCUS</span><strong>Rocket avionics</strong></div>
            <div><span>LOCAL</span><strong>{time} BST</strong></div>
          </div>
        </div>

        <FlightScene />
      </section>

      <section className="profile section shell" id="profile">
        <SectionHeading
          index="01"
          label="Mission profile"
          title="Curious by design. Hands-on by default."
          copy="I work where electronics, software and aircraft systems meet — learning by building, testing and improving real systems with real constraints."
        />

        <div className="profile-grid">
          <div className="profile-statement reveal">
            <span className="coordinate">AVIONICS / EMBEDDED / SOFTWARE</span>
            <p>
              Currently pursuing a <strong>B.Sc. in Avionics Engineering</strong>, I have
              developed hands-on skills in circuit integration, sensor interfacing, PCB
              design and fabrication, microcontroller- and microprocessor-based systems,
              and embedded C and Python programming.
            </p>
            <p>
              Through university technical projects, I have applied practical
              problem-solving skills while continuing to expand my knowledge of avionics
              technology. I am eager to learn, implement new concepts, and contribute my
              technical knowledge, teamwork, and dedication to real-world engineering work.
            </p>
            <p>
              I am also part of a small software service startup where we design, develop,
              and maintain websites, web applications, and user interfaces. Alongside this,
              I volunteer part-time with RCY and have developed experience in humanitarian
              initiatives, fundraising, team management, coordination, and collaborative work.
            </p>
          </div>

          <div
            className="profile-matrix reveal tilt-surface"
            aria-label="Profile overview"
            onPointerMove={handleTilt}
            onPointerLeave={resetTilt}
          >
            <div className="matrix-cell wide">
              <span>EDUCATION STREAM</span>
              <strong>B.Sc. Avionics Engineering</strong>
              <small>2023 — Present</small>
            </div>
            <div className="matrix-cell">
              <span>CORE MODE</span>
              <strong>BUILD / TEST</strong>
              <small>Hands-on systems</small>
            </div>
            <div className="matrix-cell">
              <span>SECOND VECTOR</span>
              <strong>WEB / UI</strong>
              <small>Software delivery</small>
            </div>
          </div>
        </div>
      </section>

      <section className="systems section shell" id="systems">
        <SectionHeading
          index="02"
          label="Technical systems"
          title="A cross-domain engineering stack."
          copy="Capabilities developed through university teams, independent builds, technical competitions and software work."
        />

        <div className="capability-grid">
          {capabilityGroups.map((capability, index) => (
            <article
              className="capability-card reveal tilt-surface"
              style={{ "--delay": `${index * 70}ms` }}
              key={capability.code}
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
            >
              <div className="capability-top">
                <span>{capability.code}</span>
                <small><i /> {capability.status}</small>
              </div>
              <div className="capability-glyph" aria-hidden="true">
                <i /><i /><i />
              </div>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </article>
          ))}
        </div>

        <div className="tool-chain reveal" aria-label="Tools and technologies">
          <span>ACTIVE TOOLCHAIN</span>
          <div>
            {[
              "C", "Python", "Arduino", "ESP32", "PCB Design", "Micro-soldering",
              "Sensor Interfacing", "UI Design", "Web Development", "Excel / Reporting",
            ].map((tool) => <b key={tool}>{tool}</b>)}
          </div>
        </div>
      </section>

      <section className="missions section shell" id="missions">
        <SectionHeading
          index="03"
          label="Selected missions"
          title="Systems I am helping bring to life."
          copy="Select a mission to inspect its objective, engineering scope and technical signal."
        />

        <div
          className="mission-console reveal tilt-surface"
          onPointerMove={handleTilt}
          onPointerLeave={resetTilt}
        >
          <div className="mission-list" aria-label="Project missions">
            {missions.map((mission) => (
              <button
                key={mission.id}
                className={activeMission.id === mission.id ? "active" : ""}
                type="button"
                aria-pressed={activeMission.id === mission.id}
                onClick={() => setActiveMission(mission)}
              >
                <span>{mission.number}</span>
                <strong>{mission.title}</strong>
                <small>{mission.subtitle}</small>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>

          <article className="mission-display" key={activeMission.id} aria-live="polite">
            <div className="display-grid" aria-hidden="true" />
            <div className="display-status">
              <span><i /> DATA LINK ACTIVE</span>
              <small>{activeMission.number} / DOSSIER</small>
            </div>
            <div className="display-copy">
              <span>{activeMission.subtitle}</span>
              <h3>{activeMission.title}</h3>
              <p>{activeMission.description}</p>
              <div className="mission-tags">
                {activeMission.tags.map((tag) => <b key={tag}>{tag}</b>)}
              </div>
            </div>
            <div className="mission-readout" aria-hidden="true">
              <div className="readout-ring" style={{ "--value": `${activeMission.signal}%` }}>
                <strong>{activeMission.signal}</strong>
                <span>SIG</span>
              </div>
              <small>{activeMission.metric}</small>
            </div>
          </article>
        </div>
      </section>

      <section className="experience section shell" id="experience">
        <SectionHeading
          index="04"
          label="Field log"
          title="Engineering, leadership & service."
          copy="Technical growth is stronger when it includes communication, coordination and responsibility beyond the workbench."
        />

        <div className="experience-log">
          {experience.map((item, index) => (
            <article className="experience-row reveal" style={{ "--delay": `${index * 60}ms` }} key={`${item.place}-${item.role}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{item.period}</small>
              <div>
                <h3>{item.role}</h3>
                <b>{item.place}</b>
              </div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
