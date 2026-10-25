import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Menu,
  X,
  Mail,
  MessageCircle,
  Phone,
  Github,
  Rocket,
  Users,
  Code2,
  Layers,
  Sparkles,
} from "lucide-react";
import { profile, featuredNames, skillGroups } from "./config";
import { useSceneMotion } from "./useSceneMotion";
import azMusicIcon from "./assets/azmusic.svg";
import jarvisIcon from "./assets/jarvis.svg";
import remoteIcon from "./assets/az-remote-connect.svg";

const featuredIcons = [azMusicIcon, jarvisIcon, remoteIcon];
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
  const nav = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const trackScroll = () => setScrolled(window.scrollY > 24);
    trackScroll();
    window.addEventListener("scroll", trackScroll, { passive: true });
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
    const closeOutside = (event: PointerEvent) => { if (open && !nav.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", trackScroll);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="#home" aria-label="Azeem, back to top">
        <img src={`${import.meta.env.BASE_URL}images/az-logo.svg`} alt="" width="54" height="54" />
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
        ref={nav}
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
      <a className="nav-contact" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Open Mohammed Azeem GitHub profile">
        GitHub <ArrowUpRight size={15} />
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
          <a className="button hero-connect-button" href={`${import.meta.env.BASE_URL}images/mohammed-azeem-cv.svg`} target="_blank" rel="noopener noreferrer" aria-label="View my CV image">
            View My CV <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="portrait-stage">
        <div className="portrait-backlight" aria-hidden="true" />
        <div className="portrait-halo" aria-hidden="true" />
        <div className="orbit orbit-one depth" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
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
      <div className="scene-symbol scene-symbol-about" aria-hidden="true">
        <Code2 size={48} strokeWidth={1.4} />
      </div>
      <div className="about-layout">
        <h2>
          BEYOND
          <br />
          THE <span className="accent">PIXELS.</span>
        </h2>
        <div className="about-copy">
          <p className="intro">{profile.about}</p>
          <p className="muted">{profile.approach}</p>
          <div className="about-profile-details" aria-label="Personal profile"><span>Born 2007</span><span>Kandy, Sri Lanka</span><span>A/L Completed</span><span>English · Tamil · Sinhala</span></div>
          <p className="about-interests">App Development · UI/UX Design · Video Editing · Web Development · Photography</p>
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
      <div className="scene-symbol scene-symbol-toolkit" aria-hidden="true">
        <Layers size={46} strokeWidth={1.4} />
      </div>
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
      <div className="scene-symbol scene-symbol-work" aria-hidden="true">
        <Sparkles size={46} strokeWidth={1.4} />
      </div>
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
            <span className="featured-icon-shell" aria-hidden="true">
              <img src={featuredIcons[index]} alt="" width="92" height="92" loading="lazy" />
            </span>
            <h3>{name}</h3>
            <p className="featured-description">{["Music discovery and listening experience.","An experimental personal AI assistant.","Remote desktop connectivity tools."][index]}</p>
            <span className="featured-line" aria-hidden="true" />
          </div>
        ))}
      </div>
      <a className="button primary work-project-link" href={profile.projectsUrl} target="_blank" rel="noopener noreferrer">Explore all projects <ArrowUpRight size={18}/></a>
      <p className="work-note">
        See the full collection, current releases and what each project does in AZ Appverse.
      </p>
    </section>
  );
}
function ContactSection() {
  const whatsapp = `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`;
  return (
    <section id="contact" className="contact scene section-pad">
      <Chapter number="04" label="THE NEXT CHAPTER" />
      <div className="contact-showcase">
        <div className="contact-intro">
          <p className="eyebrow">04 / CONTACT · OPEN TO IDEAS</p>
          <h2>LET’S BUILD<br /><span className="accent">SOMETHING.</span></h2>
          <p className="contact-description">Have an idea, a project, or just want to connect?<br />I’d love to hear from you.</p>
          <div className="contact-interests" aria-label="Reasons to get in touch">
            <span><Rocket size={18} aria-hidden="true" /> New projects</span>
            <span><Users size={18} aria-hidden="true" /> Collaboration</span>
            <span><MessageCircle size={18} aria-hidden="true" /> Say hello</span>
          </div>
        </div>
        <div className="contact-card">
          <div className="contact-card-header">
            <span>START A CONVERSATION</span>
            <span className="contact-availability"><span aria-hidden="true" /> {profile.availability}</span>
          </div>
          <div className="contact-methods">
            <a href={`mailto:${profile.email}`} className="contact-method">
              <span className="contact-method-icon"><Mail size={25} aria-hidden="true" /></span>
              <span className="contact-method-copy"><strong>Email me</strong><small>{profile.email}</small></span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="contact-method">
              <span className="contact-method-icon"><MessageCircle size={25} aria-hidden="true" /></span>
              <span className="contact-method-copy"><strong>WhatsApp</strong><small>{profile.whatsapp}</small></span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a href={`tel:${profile.phone}`} className="contact-method">
              <span className="contact-method-icon"><Phone size={25} aria-hidden="true" /></span>
              <span className="contact-method-copy"><strong>Call me</strong><small>{profile.phone}</small></span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-method">
              <span className="contact-method-icon"><Github size={25} aria-hidden="true" /></span>
              <span className="contact-method-copy"><strong>GitHub</strong><small>Explore my development work</small></span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </div>
          <a className="contact-card-cta" href={`mailto:${profile.email}`}>
            <Mail size={20} aria-hidden="true" /> Send a message <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <p className="contact-card-footer">Let’s turn ideas into something useful.</p>
        </div>
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
      <div className="scroll-progress" aria-hidden="true" />
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


