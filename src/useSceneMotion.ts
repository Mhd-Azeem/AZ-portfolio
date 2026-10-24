import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useSceneMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        // Essential content always stays visible: motion changes transforms, never visibility.
        gsap.utils.toArray<HTMLElement>('.scene').forEach(scene => {
          const heading = scene.querySelector('h1, h2');
          if (heading) gsap.from(heading, { y: 55, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 98%', toggleActions: 'play none none reverse' } });
          const layers = scene.querySelectorAll('.depth');
          if (layers.length) gsap.fromTo(layers, { y: 32 }, { y: -32, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        });
        gsap.to('.portrait-scroll', { y: 65, scale: .96, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.utils.toArray<HTMLElement>('.project-art').forEach(panel => {
          gsap.fromTo(panel, { scale: .96, y: 40 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'center center', scrub: .7 } });
        });
        gsap.from('.skill-card', { y: 32, stagger: .12, duration: .8, scrollTrigger: { trigger: '#toolkit', start: 'top 65%' } });
      }, root);
      return () => context.revert();
    });
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => { alive = false; window.removeEventListener('load', refresh); media.revert(); };
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const query = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    let tween: gsap.core.Tween | undefined;
    const move = (event: PointerEvent) => {
      if (!query.matches || event.pointerType === 'touch') return;
      element.style.setProperty('--pointer-x', `${event.clientX}px`);
      element.style.setProperty('--pointer-y', `${event.clientY}px`);
      tween?.kill();
      tween = gsap.to('.portrait-pointer', { x: (event.clientX / innerWidth - .5) * 14, y: (event.clientY / innerHeight - .5) * 10, duration: .7, overwrite: true });
    };
    const reset = () => { tween?.kill(); gsap.set('.portrait-pointer', { clearProps: 'transform' }); };
    window.addEventListener('pointermove', move, { passive: true });
    query.addEventListener('change', reset);
    return () => { window.removeEventListener('pointermove', move); query.removeEventListener('change', reset); reset(); };
  }, []);
  return root;
}
