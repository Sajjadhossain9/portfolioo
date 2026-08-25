import { useEffect, useState } from "react";

function BrandPortrait() {
  return (
    <span className="brand-portrait" aria-hidden="true">
      <img
        src={`${import.meta.env.BASE_URL}header-portrait.webp`}
        alt=""
        width="48"
        height="48"
        decoding="async"
      />
    </span>
  );
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
          <BrandPortrait />
          <span>
            <strong>SAJJAD HOSSAIN</strong>
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
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#systems" onClick={closeMenu}>Status</a>
          <a href="#contact" className="nav-contact" onClick={closeMenu}>Establish contact</a>
          <a
            href="https://www.linkedin.com/in/sajjad-hossain-369929299/"
            className="nav-hire"
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            Hire
          </a>
        </div>
      </nav>
    </header>
  );
}
