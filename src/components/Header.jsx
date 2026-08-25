import { useEffect, useState } from "react";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">SH</span>;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
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
          aria-controls="primary-navigation-links"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <i />
          <i />
        </button>

        <div
          className={`nav-links ${menuOpen ? "open" : ""}`}
          id="primary-navigation-links"
        >
          <a href="#profile" onClick={closeMenu}>Profile</a>
          <a href="#systems" onClick={closeMenu}>Systems</a>
          <a href="#missions" onClick={closeMenu}>Missions</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#code" onClick={closeMenu}>Code</a>
          <a href="#contact" className="nav-contact" onClick={closeMenu}>Establish contact</a>
        </div>
      </nav>
    </header>
  );
}
