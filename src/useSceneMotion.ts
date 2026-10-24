import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSceneMotion() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // Only animate individual children. Never animate the same transform
        // from the pointer handler and ScrollTrigger.
        gsap.utils.toArray<HTMLElement>(".scene").forEach((scene) => {
          const heading = scene.querySelector<HTMLElement>("h1, h2");
          if (heading) {
            gsap.fromTo(heading, { y: 56, rotateX: 5 }, {
              y: 0, rotateX: 0, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: scene, start: "top 85%", toggleActions: "play none none reverse" },
            });
          }
          const chapter = scene.querySelector<HTMLElement>(".chapter");
          if (chapter) {
            gsap.fromTo(chapter, { x: -38 }, {
              x: 0, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: scene, start: "top 80%", toggleActions: "play none none reverse" },
            });
          }
          const depth = scene.querySelectorAll<HTMLElement>(".depth");
          if (depth.length) {
            gsap.fromTo(depth, { y: 38 }, {
              y: -38, ease: "none",
              scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1 },
            });
          }
        });

        gsap.fromTo(".portrait-scroll", { y: 0 }, {
          y: 62, ease: "none",
          scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.8 },
        });

        const groups = [
          { selector: ".about-copy > *, .about-bottom > *", trigger: "#about" },
          { selector: ".skill-card", trigger: "#toolkit" },
          { selector: ".featured-card", trigger: "#work" },
          { selector: ".contact-bottom > *, .contact-links > *", trigger: "#contact" },
        ];
        groups.forEach(({ selector, trigger }) => {
          gsap.utils.toArray<HTMLElement>(selector).forEach((item, index) => {
            gsap.fromTo(item, { y: 42, scale: 0.975 }, {
              y: 0, scale: 1, duration: 1, delay: Math.min(index * 0.09, 0.36), ease: "power3.out",
              scrollTrigger: { trigger, start: "top 76%", toggleActions: "play none none reverse" },
            });
          });
        });

        gsap.utils.toArray<HTMLElement>(".scene-symbol").forEach((symbol) => {
          gsap.fromTo(symbol, { x: 48, rotate: -14, scale: 0.85 }, {
            x: 0, rotate: 0, scale: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: symbol.closest(".scene"), start: "top 78%", toggleActions: "play none none reverse" },
          });
        });
      }, element);
      return () => context.revert();
    });

    // Desktop pointer: one smoothed target, one ticker; no per-event tweens.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const hero = element.querySelector<HTMLElement>("#home");
    const portrait = element.querySelector<HTMLElement>(".portrait-pointer");
    const orbit = element.querySelector<HTMLElement>(".orbit-two");
    const halo = element.querySelector<HTMLElement>(".portrait-halo");
    const back = element.querySelector<HTMLElement>(".portrait-backlight");
    let x = 0, y = 0, tx = 0, ty = 0;
    let active = false;
    let ticking = false;
    const stopTick = () => { if (ticking) { gsap.ticker.remove(tick); ticking = false; } };
    const startTick = () => { if (!ticking && finePointer.matches && !document.hidden) { gsap.ticker.add(tick); ticking = true; } };
    const setX = portrait ? gsap.quickSetter(portrait, "x", "px") : null;
    const setY = portrait ? gsap.quickSetter(portrait, "y", "px") : null;
    const setOrbitX = orbit ? gsap.quickSetter(orbit, "x", "px") : null;
    const setOrbitY = orbit ? gsap.quickSetter(orbit, "y", "px") : null;
    const setHaloX = halo ? gsap.quickSetter(halo, "x", "px") : null;
    const setHaloY = halo ? gsap.quickSetter(halo, "y", "px") : null;
    const setBackX = back ? gsap.quickSetter(back, "x", "px") : null;
    const setBackY = back ? gsap.quickSetter(back, "y", "px") : null;
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch" || !hero) return;
      const bounds = hero.getBoundingClientRect();
      tx = gsap.utils.clamp(-1, 1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)) * 16;
      ty = gsap.utils.clamp(-1, 1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)) * 11;
      startTick();
    };
    const reset = () => { tx = 0; ty = 0; startTick(); };
    const tick = () => {
      if (!finePointer.matches || document.hidden) { stopTick(); return; }
      x += (tx - x) * 0.085;
      y += (ty - y) * 0.085;
      if (Math.abs(x) < 0.01 && Math.abs(tx) < 0.01) x = 0;
      if (Math.abs(y) < 0.01 && Math.abs(ty) < 0.01) y = 0;
      setX?.(x); setY?.(y);
      setOrbitX?.(-x * 1.2); setOrbitY?.(-y * 1.2);
      setHaloX?.(x * 1.45); setHaloY?.(y * 1.45);
      setBackX?.(-x * 1.8); setBackY?.(-y * 1.8);
      if (Math.abs(x - tx) < 0.02 && Math.abs(y - ty) < 0.02) stopTick();
    };
    const enablePointer = () => {
      if (active || !finePointer.matches || !hero || !portrait) return;
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", reset);
      active = true;
    };
    const disablePointer = () => {
      if (active && hero) {
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", reset);
      }
      stopTick();
      active = false; reset(); x = 0; y = 0;
      if (portrait) gsap.set(portrait, { clearProps: "x,y" });
      if (orbit) gsap.set(orbit, { clearProps: "x,y" });
      if (halo) gsap.set(halo, { clearProps: "x,y" });
      if (back) gsap.set(back, { clearProps: "x,y" });
    };
    const mediaChange = () => { disablePointer(); enablePointer(); };
    enablePointer();
    finePointer.addEventListener("change", mediaChange);
    const visibilityChange = () => { if (document.hidden) stopTick(); }; 
    document.addEventListener("visibilitychange", visibilityChange);

    let alive = true;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(() => { if (alive) refresh(); });
    const portraitImage = element.querySelector<HTMLImageElement>(".portrait");
    portraitImage?.addEventListener("load", refresh);
    window.addEventListener("load", refresh);
    return () => {
      alive = false;
      finePointer.removeEventListener("change", mediaChange);
      document.removeEventListener("visibilitychange", visibilityChange);
      disablePointer();
      portraitImage?.removeEventListener("load", refresh);
      window.removeEventListener("load", refresh);
      media.revert();
    };
  }, []);

  return root;
}
