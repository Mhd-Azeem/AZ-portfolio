# AZ Portfolio

A five-scene portfolio for Mohammed Azeem, built with React, TypeScript, Vite and GSAP ScrollTrigger.

## Development

```sh
npm ci
npm run dev
npm run build
npm test
npm run test:e2e
npm run preview
```

## GitHub Pages

Live URL: https://mhd-azeem.github.io/AZ-portfolio/

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. Every push to `main` builds and deploys the `dist` directory through `.github/workflows/build.yml`. Pull requests build without deploying. No Netlify services or configuration are used.

Vite's base is `/AZ-portfolio/`. Portrait assets use `import.meta.env.BASE_URL` so they work under the repository subpath.

## Personalize

The current redesign follows the requested neon purple/blue glass direction. The referenced chat did not expose its generated mockup image, so exact visual correspondence could not be measured. Featured work comes before Toolkit and About on both desktop and mobile.

Project artwork is existing repository artwork. The two interface studies in each project dialog are explicitly labeled illustrative concepts, not captured application screenshots. The CV uses the existing CV PNG. Responsive WebP portraits are derived from the original portrait (480px / 800px, approximately 41KB / 93KB); original source assets are retained.

Browser checks cover 320–1440px overflow, portrait loading, all three project dialogs, preview disclosures, focus trapping/restoration, background isolation, CV loading/download and mobile navigation. Local tests use installed Chrome; CI installs Chromium and tests the production preview before deployment. To use Chromium locally instead, install it with `npx playwright install chromium` and run with `CI=1`.

Edit `src/config.ts` for personal information, skills, the AZ Appverse destination and contact information. Portrait paths are relative to `public/`. The existing portrait and contact details are retained from the original portfolio. The work section uses AzMusic, Jarvis and AZ Remote Connect artwork from the companion AZ Appverse site; AZ Appverse hosts the full project catalog.

## Motion and accessibility

`src/useSceneMotion.ts` owns and cleans up GSAP timelines, scroll entrances for app icons and decorative symbols, and pointer effects. It respects changes to reduced-motion settings. Native anchors, visible focus rings, a skip link, an Escape-dismissable mobile menu and active-section indicators support keyboard navigation. Essential content stays visible even when motion initialization fails. The static fallback inside `index.html` offers biography, the AZ Appverse link and contact if JavaScript is disabled or unavailable.


