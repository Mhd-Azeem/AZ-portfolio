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
  Download,
  Music2,
  Monitor,
  Bot,
} from "lucide-react";
import { profile, featuredNames, skillGroups } from "./config";
import { useSceneMotion } from "./useSceneMotion";
import azMusicIcon from "./assets/azmusic.svg";
import jarvisIcon from "./assets/jarvis.svg";
import remoteIcon from "./assets/az-remote-connect.svg";

const featuredIcons = [azMusicIcon, jarvisIcon, remoteIcon];
const cvUrl = `${import.meta.env.BASE_URL}images/mohammed-azeem-cv.png`;
const projects = [
  {
    name: "AzMusic",
    category: "Android / Windows",
    status: "In development",
    description:
      "A music listening experience with artist discovery, playlists, playback controls and a personal library.",
    features: ["Artist discovery", "Music playback", "Playlists & library"],
    repo: "https://github.com/Mhd-Azeem",
    preview: "music",
  },
  {
    name: "Jarvis",
    category: "AI / Assistant",
    status: "Coming soon",
    description:
      "A personal assistant project exploring useful automation, conversational tools and a unified interface.",
    features: [
      "Assistant interface",
      "Automation ideas",
      "Cross-device vision",
    ],
    repo: "https://github.com/Mhd-Azeem",
    preview: "assistant",
  },
  {
    name: "AZ Remote Connect",
    category: "Android / Windows",
    status: "In development",
    description:
      "A remote-access software project designed to connect devices through a simple, secure interface.",
    features: ["Remote connectivity", "Desktop access", "Device management"],
    repo: "https://github.com/Mhd-Azeem",
    preview: "remote",
  },
] as const;

function useModalAccessibility(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, header, footer, .skip-link",
      ),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex="0"]',
        ),
      );
      if (!elements.length) return;
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);
  return { dialogRef, closeRef };
}

function CvModal({ onClose }: { onClose: () => void }) {
  const { dialogRef, closeRef } = useModalAccessibility(true, onClose);
  return (
    <div
      className="az-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="az-modal az-cv-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-title"
      >
        <div className="az-modal-header">
          <h2 id="cv-title">
            MY CV <span> / MOHAMMED AZEEM</span>
          </h2>
          <div className="az-modal-tools">
            <a
              href={cvUrl}
              download="Mohammed-Azeem-CV.png"
              className="az-modal-download"
            >
              <Download size={17} /> Download
            </a>
            <button
              ref={closeRef}
              type="button"
              className="az-modal-close"
              onClick={onClose}
              aria-label="Close CV"
            >
              <X size={23} />
            </button>
          </div>
        </div>
        <div className="az-cv-scroll">
          <img
            src={cvUrl}
            alt="Mohammed Azeem CV with personal details, projects, contact information and skill levels"
            width="1024"
            height="1536"
          />
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({ type, number }: { type: string; number: number }) {
  return (
    <div
      className={`az-project-preview az-preview-${type} az-preview-${number}`}
      aria-label="Illustrative interface concept, not an application screenshot"
    >
      <div className="az-preview-top">
        <span className="az-preview-dot" />
        <span className="az-preview-dot" />
        <span className="az-preview-dot" />
        <span>AZ / CONCEPT</span>
      </div>
      {type === "music" ? (
        <div className="az-preview-content">
          <Music2 size={38} />
          <strong>{number === 1 ? "Now Playing" : "Discover Music"}</strong>
          <div className="az-preview-track" />
          <div className="az-preview-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      ) : type === "assistant" ? (
        <div className="az-preview-content">
          <Bot size={40} />
          <strong>
            {number === 1 ? "Hello, I'm Jarvis" : "Your Assistant"}
          </strong>
          <div className="az-preview-chat" />
          <div className="az-preview-chat short" />
        </div>
      ) : (
        <div className="az-preview-content">
          <Monitor size={40} />
          <strong>{number === 1 ? "Remote Desktop" : "Connect Devices"}</strong>
          <div className="az-preview-screen" />
          <div className="az-preview-track" />
        </div>
      )}
      <span className="az-preview-caption">
        Illustrative preview · Screenshots coming soon
      </span>
    </div>
  );
}

function ProjectModal({
  index,
  onClose,
}: {
  index: number;
  onClose: () => void;
}) {
  const project = projects[index];
  const { dialogRef, closeRef } = useModalAccessibility(true, onClose);
  return (
    <div
      className="az-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="az-modal az-project-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
      >
        <div className="az-modal-header">
          <span className="az-modal-kicker">PROJECT 0{index + 1} / AZ</span>
          <button
            ref={closeRef}
            type="button"
            className="az-modal-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            <X size={23} />
          </button>
        </div>
        <div className="az-project-modal-body">
          <div className="az-project-modal-title">
            <img src={featuredIcons[index]} alt="" width="62" height="62" />
            <div>
              <h2 id="project-title">{project.name}</h2>
              <p>
                {project.category} · {project.status}
              </p>
            </div>
          </div>
          <p className="az-project-summary">{project.description}</p>
          <p className="preview-disclosure">
            Interface studies · Illustrations only, not screenshots of the
            applications.
          </p>
          <div className="az-project-previews">
            <ProjectPreview type={project.preview} number={1} />
            <ProjectPreview type={project.preview} number={2} />
          </div>
          <h3 className="az-project-subtitle">Highlights</h3>
          <ul className="az-project-features">
            {project.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a
            className="az-project-more"
            href={profile.projectsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the project catalog <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
const links = [
  ["work", "Work"],
  ["toolkit", "Toolkit"],
  ["about", "About"],
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
    const closeOutside = (event: PointerEvent) => {
      if (
        open &&
        !nav.current?.contains(event.target as Node) &&
        !toggle.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
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
        <img
          src={`${import.meta.env.BASE_URL}images/az-logo.svg`}
          alt=""
          width="54"
          height="54"
        />
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
      <a
        className="nav-contact"
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Mohammed Azeem GitHub profile"
      >
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
function HeroSection({ onViewCv }: { onViewCv: () => void }) {
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
          <a className="button primary" href="#work">
            Explore my work <ArrowUpRight size={18} />
          </a>
          <button
            type="button"
            className="button hero-connect-button"
            onClick={onViewCv}
            aria-haspopup="dialog"
          >
            View My CV <ArrowUpRight size={18} aria-hidden="true" />
          </button>
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
              src={`${import.meta.env.BASE_URL}images/azeem-800.webp`}
              srcSet={`${import.meta.env.BASE_URL}images/azeem-480.webp 480w, ${import.meta.env.BASE_URL}images/azeem-800.webp 800w`}
              sizes="(max-width: 700px) 85vw, 42vw"
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
        <a href="#work">
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
      <Chapter number="03" label="BEHIND THE SCREEN" />
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
          <div className="about-profile-details" aria-label="Personal profile">
            <span>Born 2007</span>
            <span>Kandy, Sri Lanka</span>
            <span>A/L Completed</span>
            <span>English · Tamil · Sinhala</span>
          </div>
          <p className="about-interests">
            App Development · UI/UX Design · Video Editing · Web Development ·
            Photography
          </p>
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
function WorkSection({
  onProjectClick,
}: {
  onProjectClick: (index: number) => void;
}) {
  return (
    <section id="work" className="work scene section-pad">
      <Chapter number="01" label="FEATURED PROJECTS" />
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
          <button
            type="button"
            className="featured-card az-featured-button"
            key={name}
            onClick={() => onProjectClick(index)}
            aria-haspopup="dialog"
            aria-label={`View details about ${name}`}
          >
            <span className="featured-number">
              0{index + 1} / {projects[index].category}
            </span>
            <span className="featured-icon-shell" aria-hidden="true">
              <img
                src={featuredIcons[index]}
                alt=""
                width="92"
                height="92"
                loading="lazy"
              />
            </span>
            <span className="project-status">{projects[index].status}</span>
            <h3>{name}</h3>
            <p className="featured-description">
              {
                [
                  "Music discovery and listening experience.",
                  "An experimental personal AI assistant.",
                  "Remote desktop connectivity tools.",
                ][index]
              }
            </p>
            <span className="featured-line" aria-hidden="true" />
            <span className="az-featured-more">
              View details <ArrowUpRight size={16} />
            </span>
          </button>
        ))}
      </div>
      <a
        className="button primary work-project-link"
        href={profile.projectsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Explore all projects <ArrowUpRight size={18} />
      </a>
      <p className="work-note">
        See the full collection, current releases and what each project does in
        AZ Appverse.
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
          <h2>
            LET’S BUILD
            <br />
            <span className="accent">SOMETHING.</span>
          </h2>
          <p className="contact-description">
            Have an idea, a project, or just want to connect?
            <br />
            I’d love to hear from you.
          </p>
          <div
            className="contact-interests"
            aria-label="Reasons to get in touch"
          >
            <span>
              <Rocket size={18} aria-hidden="true" /> New projects
            </span>
            <span>
              <Users size={18} aria-hidden="true" /> Collaboration
            </span>
            <span>
              <MessageCircle size={18} aria-hidden="true" /> Say hello
            </span>
          </div>
        </div>
        <div className="contact-card">
          <div className="contact-card-header">
            <span>START A CONVERSATION</span>
            <span className="contact-availability">
              <span aria-hidden="true" /> {profile.availability}
            </span>
          </div>
          <div className="contact-methods">
            <a href={`mailto:${profile.email}`} className="contact-method">
              <span className="contact-method-icon">
                <Mail size={25} aria-hidden="true" />
              </span>
              <span className="contact-method-copy">
                <strong>Email me</strong>
                <small>{profile.email}</small>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-method"
            >
              <span className="contact-method-icon">
                <MessageCircle size={25} aria-hidden="true" />
              </span>
              <span className="contact-method-copy">
                <strong>WhatsApp</strong>
                <small>{profile.whatsapp}</small>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a href={`tel:${profile.phone}`} className="contact-method">
              <span className="contact-method-icon">
                <Phone size={25} aria-hidden="true" />
              </span>
              <span className="contact-method-copy">
                <strong>Call me</strong>
                <small>{profile.phone}</small>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-method"
            >
              <span className="contact-method-icon">
                <Github size={25} aria-hidden="true" />
              </span>
              <span className="contact-method-copy">
                <strong>GitHub</strong>
                <small>Explore my development work</small>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </div>
          <a className="contact-card-cta" href={`mailto:${profile.email}`}>
            <Mail size={20} aria-hidden="true" /> Send a message{" "}
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
          <p className="contact-card-footer">
            Let’s turn ideas into something useful.
          </p>
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
  const [showCv, setShowCv] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="ambient-pointer" aria-hidden="true" />
      <Navbar />
      <div className="scroll-progress" aria-hidden="true" />
      <main id="main">
        <HeroSection onViewCv={() => setShowCv(true)} />
        <WorkSection onProjectClick={setActiveProject} />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      {showCv && <CvModal onClose={() => setShowCv(false)} />}
      {activeProject !== null && (
        <ProjectModal
          index={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
