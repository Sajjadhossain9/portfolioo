import { useEffect, useState } from "react";

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
    id: "rocket",
    number: "M-01",
    title: "Rocket avionics",
    subtitle: "Team Shunno / Flight systems",
    description:
      "Developing the electronics layer of a student rocket: controller integration, navigation, component soldering, Ground Control Station UI and parachute deployment testing.",
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
    role: "Rocket Avionics Team Member",
    place: "TEAM SHUNNO",
    text: "Embedded integration, navigation, recovery electronics and GCS interface development.",
  },
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

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">SH</span>;
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

export default function App() {
  const [time, setTime] = useState("--:--:--");
  const [menuOpen, setMenuOpen] = useState(false);
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Sajjad Hossain home" onClick={closeMenu}>
          <BrandMark />
          <span>
            <strong>SAJJAD HOSSAIN</strong>
            <small>AVIONICS / SYSTEMS</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <i />
          <i />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#profile" onClick={closeMenu}>Profile</a>
          <a href="#systems" onClick={closeMenu}>Systems</a>
          <a href="#missions" onClick={closeMenu}>Missions</a>
          <a href="#contact" className="nav-contact" onClick={closeMenu}>Establish contact</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-copy">
          <div className="status-row">
            <span className="eyebrow"><i /> Mission profile / 04</span>
            <span className="nominal">SYSTEMS NOMINAL</span>
          </div>

          <h1>
            Engineering the link between
            <span> flight, electronics & software.</span>
          </h1>

          <p>
            I&apos;m <strong>Md. Sajjad Hossain</strong>, an avionics engineering
            student building embedded sensing, intelligent flight interfaces
            and software that turns system data into confident decisions.
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
          </div>

          <div className="telemetry">
            <div><span>LOC</span><strong>Lalmonirhat, BD</strong></div>
            <div><span>FOCUS</span><strong>Rocket avionics</strong></div>
            <div><span>LOCAL</span><strong>{time} BST</strong></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Animated avionics identity display">
          <div className="corners" />
          <div className="radar large" />
          <div className="radar small" />
          <div className="sweep" />
          <div className="orbit one"><i /></div>
          <div className="orbit two"><i /></div>
          <div className="identity-core">
            <strong>SH</strong>
            <span>AVIONICS / 04</span>
          </div>
          <span className="hud-label top">AVN-SYS / ID VERIFIED</span>
          <span className="hud-label right">ALT 03620<br />HDG 042°</span>
          <span className="hud-label bottom">TARGET: RELIABLE SYSTEMS</span>
          <div className="signal"><i /><i /><i /><i /><i /><i /></div>
        </div>
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
              Currently pursuing a <strong>B.Sc. in Avionics Engineering</strong>,
              I&apos;m focused on embedded electronics, circuit integration, sensing,
              control interfaces and the software layer around flight systems.
            </p>
            <p>
              My goal is to grow into an engineer who can understand the full signal
              path — from a physical sensor to a dependable decision on screen.
            </p>
          </div>

          <div className="profile-matrix reveal" aria-label="Profile overview">
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
            <article className="capability-card reveal" style={{ "--delay": `${index * 70}ms` }} key={capability.code}>
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

        <div className="mission-console reveal">
          <div className="mission-list" role="list" aria-label="Project missions">
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

          <article className="mission-display" key={activeMission.id}>
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
            <div className="mission-readout" aria-label={`Mission signal ${activeMission.signal} percent`}>
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

      <footer className="contact shell" id="contact">
        <div className="contact-copy reveal">
          <span><i /> CHANNEL OPEN</span>
          <h2>Let&apos;s build something that has to work.</h2>
          <p>Open to collaborations across avionics, embedded systems, research and software projects.</p>
          <a
            className="button primary"
            href="https://www.linkedin.com/in/sajjad-hossain-369929299/"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn <Arrow />
          </a>
        </div>

        <div className="contact-links reveal">
          <a href="https://github.com/Sajjadhossain9" target="_blank" rel="noreferrer">
            <span>01</span><strong>GitHub</strong><small>/Sajjadhossain9</small>
          </a>
          <a href="https://www.linkedin.com/in/sajjad-hossain-369929299/" target="_blank" rel="noreferrer">
            <span>02</span><strong>LinkedIn</strong><small>/sajjad-hossain</small>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61578672953767" target="_blank" rel="noreferrer">
            <span>03</span><strong>Facebook</strong><small>/profile</small>
          </a>
        </div>

        <div className="footer-line">
          <span>© {new Date().getFullYear()} MD. SAJJAD HOSSAIN</span>
          <span>DESIGNED AS AN AVIONICS INTERFACE</span>
          <a href="#top">RETURN TO ORIGIN ↑</a>
        </div>
      </footer>
    </main>
  );
}
