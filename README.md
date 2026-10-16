# Andrii Maksymenko – Portfolio

<img src="./public/og.png" alt="Andrii Maksymenko – Junior Software Developer, Backend & Cloud, AI/ML research" width="100%" />

[![Live Site](https://img.shields.io/badge/live-andrii--maksymenko.com-2D5BFF?style=flat-square)](https://andrii-maksymenko.com)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![CI](https://github.com/defoltbl/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/defoltbl/portfolio/actions/workflows/ci.yml)
[![Security Headers](https://img.shields.io/badge/security%20headers-A-brightgreen?style=flat-square)](https://securityheaders.com/?q=https://andrii-maksymenko.com)

Personal portfolio site for **Andrii Maksymenko**, Junior Software Developer (Backend & Cloud, with a research background in AI/ML).

**Live:** [andrii-maksymenko.com](https://andrii-maksymenko.com)

## About

A portfolio with a case-study page for each major project – built to show how the work was
done, not only what it is: a native macOS AI app (JobHelper), a deployed Kotlin/Ktor REST API on
Azure, a local RAG assistant, and AI/ML research presented at two international conferences.

## Preview

| Light mode | Dark mode |
|---|---|
| <img src="./public/preview-light.png" alt="Portfolio homepage in light mode" width="100%" /> | <img src="./public/preview-dark.png" alt="Portfolio homepage in dark mode" width="100%" /> |

## Tech stack

- **[Astro 7](https://astro.build)** – static site generation, near-zero shipped JavaScript
- **Content collections** – one Markdown file per project, validated by a Zod schema at build time
- **TypeScript** (strict) for data and scripts; `astro check` in CI
- Plain CSS with custom properties – light/dark theme via CSS variables
- Astro page transitions (`ClientRouter`) and a small IntersectionObserver script for scroll reveals

## Features

- **Case studies** – a page per major project: the problem, key decisions, engineering, screenshots and diagrams
- **Subtle motion** – page transitions, scroll reveals and a sticky top bar that marks the section being read; all of it switches off with *reduce motion*
- **Dark mode** – remembers the choice, follows the system preference on first visit, survives page transitions
- **Project filtering** – by category, with an animated crossfade
- **Security headers** – strict Content-Security-Policy (no inline scripts), HSTS and related headers via `vercel.json`
- **Checked before it ships** – `npm run verify` type-checks, builds, and fails on an inline script, a broken link or anchor, an image without alt text, or a page without title or description

## Project structure

```
├── public/
│   ├── AndriiMaksymenko_CV_EN.pdf   # public (no-phone) CV, linked from the site
│   ├── favicon.svg, og.png          # icon and social share preview
│   └── theme-init.js                # sets the theme before first paint (and after page transitions)
├── src/
│   ├── content/projects/*.md        # one file per project; case studies are the Markdown body
│   ├── content.config.ts            # the project schema (Zod)
│   ├── data/profile.ts              # contact, skills, experience, education, publications (typed)
│   ├── layouts/Base.astro           # head, meta tags, top bar, footer, page transitions
│   ├── components/                  # Header, Footer, ProjectCard, Timeline, SectionHead
│   ├── pages/index.astro            # home page
│   ├── pages/projects/[id].astro    # case study pages
│   ├── scripts/                     # theme switch, project filter, motion (TypeScript)
│   ├── styles/global.css
│   └── assets/                      # screenshots and diagrams (optimised at build)
├── scripts/check-dist.mjs           # checks the built pages
├── .github/workflows/ci.yml         # verify on every push and pull request
├── astro.config.mjs                 # scripts are never inlined (CSP)
└── vercel.json                      # security headers
```

To add a project, add a Markdown file to `src/content/projects/`; with `caseStudy: true`, its body
becomes a page at `/projects/<file name>/`.

## Running locally

Requires [Node.js](https://nodejs.org) 22.22 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run verify    # type check, production build, built-site checks
npm run preview   # preview the production build
```

## Deployment

Deployed on [Vercel](https://vercel.com), connected to this repository – every push to `main` triggers an automatic rebuild. DNS is managed on a custom domain via Porkbun.

## Contact

- Portfolio: [andrii-maksymenko.com](https://andrii-maksymenko.com)
- LinkedIn: [linkedin.com/in/andrii-maksymenko](https://www.linkedin.com/in/andrii-maksymenko-83628932a/)
- GitHub: [@defoltbl](https://github.com/defoltbl)
