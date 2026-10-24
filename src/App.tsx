import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Menu,
  X,
  Mail,
  Code2,
  Layers,
  Sparkles,
} from "lucide-react";
import { profile, featuredNames, skillGroups } from "./config";
import { useSceneMotion } from "./useSceneMotion";
const links = [
  ["about", "About"],
  ["toolkit", "Toolkit"],
  ["work", "Work"],
  ["contact", "Contact"],
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section")
      .forEach((section) => observer.observe(section));
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="Azeem, back to top">
        AZ<span> / </span>
      </a>
      <a className="nav-caption" href="#home">
        {profile.brand}
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="navigation"
        className={open ? "open" : ""}
        aria-label="Main navigation"
      >
        {links.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
            <span />
          </a>
        ))}
      </nav>
      <a className="nav-contact" href={`mailto:${profile.email}`}>
        Let’s talk <ArrowUpRight size={15} />
      </a>
    </header>
  );
}
function Chapter({ number, label }: { number: string; label: string }) {
  return (
    <div className="chapter">
      <span className="chapter-number">{number}</span>
      <span>{label}</span>
      <span className="chapter-line" />
    </div>
  );
}
function HeroSection() {
  return (
    <section id="home" className="hero scene">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="dot" /> INDEPENDENT DEVELOPER / CREATIVE THINKER
        </p>
        <h1>
          MOHAMMED
          <br />
          <span>
            AZEEM<span className="period">.</span>
          </span>
        </h1>
        <div className="hero-description">
          <span className="small-cross" aria-hidden="true">
            +
          </span>
          <div>
            <p className="role">{profile.subtitle}</p>
            <p className="muted">
              Building useful software with thoughtful interfaces.
              <br />
              Curious by nature. Always learning by making.
            </p>
          </div>
        </div>
        <div className="actions">
          <a className="button primary" href={profile.projectsUrl} target="_blank" rel="noopener noreferrer">
            Explore all my projects <ArrowUpRight size={18} />
          </a>
          <a className="text-link" href="#contact">
            Let’s Connect <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="portrait-stage">
        <div className="orbit orbit-one depth" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <span className="portrait-coordinate">FIG. 01 / THE CREATOR</span>
        <div className="portrait-scroll">
          <div className="portrait-pointer">
            <img
              src={`${import.meta.env.BASE_URL}${profile.portraitUrl}`}
              alt="Mohammed Azeem"
              width="1122"
              height="1402"
              fetchPriority="high"
              className="portrait"
            />
          </div>
        </div>
        <div className="portrait-tag">
          <span className="dot" /> {profile.availability}
        </div>
        <span className="portrait-mark" aria-hidden="true">
          AZ—01
        </span>
      </div>
      <div className="hero-bottom">
        <a href="#about">
          SCROLL TO DISCOVER <ArrowDown size={16} />
        </a>
        <span>CODE × DESIGN × MOTION</span>
        <span>01 — 05</span>
      </div>
    </section>
  );
}
function AboutSection() {
  return (
    <section id="about" className="about scene section-pad">
      <Chapter number="01" label="BEHIND THE SCREEN" />
      <div className="about-layout">
        <h2>
          BEYOND
          <br />
          THE <span className="accent">PIXELS.</span>
        </h2>
        <div className="about-copy">
          <p className="intro">{profile.about}</p>
          <p className="muted">{profile.approach}</p>
          <a className="text-link" href="#toolkit">
            A look inside my toolkit <ArrowDown size={17} />
          </a>
        </div>
      </div>
      <div className="about-bottom">
        <span>IDEA</span>
        <span className="process-line" />
        <span>CRAFT</span>
        <span className="process-line" />
        <span>EXPERIENCE</span>
      </div>
      <div className="outline-word depth" aria-hidden="true">
        CREATE
      </div>
    </section>
  );
}
function SkillsSection() {
  const icons = [Code2, Layers, Sparkles];
  return (
    <section id="toolkit" className="toolkit scene section-pad">
      <Chapter number="02" label="THE TOOLKIT" />
      <div className="section-heading">
        <h2>
          THINGS I<br />
          <span className="accent">CREATE</span> WITH.
        </h2>
        <p className="muted">
          Different disciplines.
          <br />
          One creative mindset.
        </p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group, i) => {
          const Icon = icons[i];
          return (
            <article key={group.title} className="skill-card">
              <div className="skill-top">
                <span>{group.category}</span>
                <Icon size={22} />
              </div>
              <h3>{group.title}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <span />
                    {skill}
                  </li>
                ))}
              </ul>
              <span className="card-corner" aria-hidden="true">
                ↗
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function WorkSection() {
  return (
    <section id="work" className="work scene section-pad">
      <Chapter number="03" label="A GLIMPSE OF WHAT I MAKE" />
      <div className="section-heading">
        <h2>
          IDEAS INTO
          <br />
          <span className="accent">EXPERIENCES.</span>
        </h2>
        <p className="muted">
          My interests move across apps, tools and creative experiments.
          <br />
          Here are a few names from that journey.
        </p>
      </div>
      <div className="featured-strip" aria-label="Examples of my work">
        {featuredNames.map((name, index) => (
          <div className="featured-card" key={name}>
            <span className="featured-number">0{index + 1} / AZ</span>
            <span className="featured-glyph" aria-hidden="true">
              {index === 0 ? "♫" : index === 1 ? "✦" : "↗"}
            </span>
            <h3>{name}</h3>
            <span className="featured-line" aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className="work-note">
        See the full collection, current releases and what each project does in AZ Appverse.
      </p>
    </section>
  );
}
function ContactSection() {
  return (
    <section id="contact" className="contact scene section-pad">
      <Chapter number="04" label="THE NEXT CHAPTER" />
      <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
      <h2>
        LET’S
        <br />
        <span className="accent">CONNECT.</span>
        <span className="contact-arrow" aria-hidden="true">
          ↗
        </span>
      </h2>
      <div className="contact-bottom">
        <p className="muted">
          An idea, a collaboration, or just a hello.
          <br />
          Every great experience starts with a conversation.
        </p>
        <a className="button primary" href={`mailto:${profile.email}`}>
          Start a Conversation <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>
          {profile.email} <Mail size={16} />
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={16} />
        </a>
        <a
          href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <a className="brand" href="#home">
        AZ<span> / </span>
      </a>
      <span>
        © {new Date().getFullYear()} {profile.name}. Made to create.
      </span>
      <a href="#home">
        BACK TO TOP <ArrowUp size={16} />
      </a>
    </footer>
  );
}
export default function App() {
  const root = useSceneMotion();
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="ambient-pointer" aria-hidden="true" />
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

