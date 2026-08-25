function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

export default function Footer() {
  return (
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
  );
}
