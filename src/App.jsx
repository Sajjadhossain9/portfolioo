import { useEffect, useState } from "react";

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

export default function App() {
  const [time, setTime] = useState("--:--:--");
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Sajjad Hossain home">
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
          <a href="#profile">Profile</a>
          <a href="#systems">Systems</a>
          <a href="#missions">Missions</a>
          <a href="#contact" className="nav-contact">Establish contact</a>
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

      <section className="next-phase shell" id="profile">
        <span>STEP 01 / FOUNDATION ONLINE</span>
        <p>Mission profile, technical systems and project briefs will be added in the next build phase.</p>
      </section>
    </main>
  );
}
