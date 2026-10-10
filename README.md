# Web Respect

Release 0.5.0 adds an owner-approved [public feed and discovery workflow](docs/discovery.md). Generate a host-branded `/feed/` hub, RSS, Atom, JSON Feed, sitemap and llms files using `web-respect-feed`; the agent skill guides publication choices and site-wide localized consent/footer integration. Only the main hub includes a small text-only Powered by Dpro link. These files support discovery without guaranteeing search rankings or AI ingestion.

<p>
  <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/gdpr-dsgvo.png" alt="Owner-declared DSGVO and GDPR compliance" height="34">
  <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/eu-ai-act.png" alt="Owner-declared EU AI Act compliance" height="34">
</p>

Owner-declared compliance statements; not independently certified. Applicability and compliance depend on the host deployment. See [regional guidance](docs/regions.md).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: initial release](https://img.shields.io/badge/status-initial_release-blue.svg)](docs/verification.md)
[![npm](https://img.shields.io/npm/v/web-respect-dpro?label=npm)](https://www.npmjs.com/package/web-respect-dpro)

A free, open-source cookie banner, accessibility and privacy toolkit developed by Dpro. Includes a local Cookie Checker / Cookie Scanner, configurable data-deletion request controls, a framework-neutral TypeScript core, isolated browser UI, bundled agent skill and optional backend adapters. No trackers or external service calls are enabled by default.

Source: https://github.com/9mtm/Web-Respect

<p align="center"><img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/nodedotjs.svg?v=brand-2" alt="Node.js" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/react.svg?v=brand-2" alt="React" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/astro.svg?v=brand-2" alt="Astro" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/svelte.svg?v=brand-2" alt="Svelte" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/vuedotjs.svg?v=brand-2" alt="Vue" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/nextdotjs.svg?v=brand-2" alt="Next.js" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/wordpress.svg?v=brand-2" alt="WordPress" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/angular.svg?v=brand-2" alt="Angular" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/python.svg?v=brand-2" alt="Python" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/typescript.svg?v=brand-2" alt="TypeScript" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/php.svg?v=brand-2" alt="PHP" height="28" width="28"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/html5.svg?v=brand-2" alt="HTML" height="28" width="28"></p>

Tested frontend integrations and optional backend runtimes; exact versions are listed in [verification](docs/verification.md).

Release 0.5.0 adds configurable controls, improved Feed hub icons, reviewed robots.txt integration and technical SEO skill guidance. Cookie attribution is a text-only Dpro link shown beneath withdrawal only while About Cookies is selected. Download the package, skill and WordPress plugin from the [0.5.0 release](https://github.com/9mtm/Web-Respect/releases/tag/v0.5.0). Install with `npm install web-respect-dpro@0.5.0` once available in the registry, or use the release tarball. Service discovery and deletion integrations remain host-configured; credentials and verified privacy requests remain host-owned.

```sh
npm ci
npm run build
npm test
node scripts/build-examples.mjs
node scripts/preview.mjs
# Open http://127.0.0.1:4328/examples/html/index.html
npm pack
```

```ts
import {mount, mountFooter} from 'web-respect-dpro/browser';
const toolkit = mount(document.querySelector('#respect')!, {
  namespace: 'my-site', locale: document.documentElement.lang,
  content: document.querySelector('main')!, // mount outside this element
  consent: {policyVersion: '2026-10'},
  policies: {cookies: '/cookies/', privacy: '/privacy/', accessibility: '/accessibility/'},
  themeVariables: {primary: '--brand', surface: '--surface', text: '--ink'},
});
const removeFooter = mountFooter(document.querySelector('footer')!, toolkit, {
  discoverLinks: true, // declared feed/MCP links only; no fetching
});
// On navigation/unmount:
removeFooter(); await toolkit.dispose();
```

The browser UI includes its own prebuilt scoped CSS. Consumers need neither Next nor Tailwind. Import `web-respect-dpro/accessibility` or `/consent` for state controllers without UI. `register()` defines the `<web-respect>` custom element only when explicitly called in the browser; module imports are SSR safe. Configure its `.config` before appending it. The standalone `dist/web-respect.js` exposes `WebRespect.mount`, `mountFooter` and `register`.

Optional services need real lifecycle callbacks. The host must remove unconditional SDK initialization and stop capture, listeners, queues and future collection on withdrawal:

```ts
consent: {
  policyVersion: '2026-10',
  services: [{id: 'measurement', category: 'analytics',
    start: async signal => { if (!signal.aborted) await sdk.start(); },
    stop: async () => { await sdk.optOut(); await sdk.shutdown(); }
  }],
  record: async record => { /* POST to your CSRF-protected host gateway */ }
}
```

No server is required for local accessibility or choices. npm ships backend reference files; PHP/Laravel and Python execute in their own runtimes. Native Composer/PyPI distribution is unavailable. Use the same contract to add Go/Java/.NET adapters.

## Agent audit skill

The [Web Respect skill](skill/web-respect/SKILL.md) starts with company establishment, target countries and US states, actual customers, service type and audience. It guides source/browser/backend inspection, current official legal research, vendor and AI-provider data flows, tenant-specific processing regions, transfers, retention and backups, privacy requests and downstream deletion, and accessibility evaluation. Initial research profiles cover EU/EEA, Brazil, the US and Australia; additional markets need their own research.

This is an agent workflow, not an automatic all-laws scanner or certification. It distinguishes observed behavior, owner declarations, missing provider access and legal decisions. Review requests remain reviews until implementation is authorized. Reports and sensitive evidence stay private unless sanitized publication is authorized.

Agent skill path: `node_modules/web-respect-dpro/skill/web-respect/SKILL.md`. Copy the complete folder including references, or download [the standalone skill ZIP](https://github.com/9mtm/Web-Respect/releases/download/v0.5.0/web-respect-skill-0.5.0.zip). Extract its `web-respect` folder into your agent's skills directory. The audit references work separately; implementation also needs the package API/backend documentation linked by the skill.

After installing the package, install into a project-local agent skills directory:

```sh
npx --no-install web-respect-skill --target .agents/skills
```

For an agent that uses another location, supply that directory explicitly. The installer only copies the skill; it never overwrites an existing `web-respect` entry, installs trackers, changes the host application or contacts providers. It needs Node 22 or newer. If installation fails after creating a new folder, inspect that partial folder before retrying.

Ask your coding agent:

> Use $web-respect to audit this project. Ask for missing company and market facts first. Inspect real services, privacy choices, accessibility, processing locations, retention and deletion. Verify current official sources. Produce an evidence-based action plan, mark unknowns and keep private information out of public output. Start with a review.

[Configuration/API](docs/api.md) · [Frontend examples](examples/README.md) · [Backend integration](backends/README.md) · [Regions](docs/regions.md) · [WordPress](examples/wordpress/README.md)

The toolkit supports engineering and compliance work. Installation is not legal advice, verified identity/age, an accessibility repair service or a WCAG/legal certificate. Canvas/3D accessibility, server-side tracking, provider data deletion, notices, lawful bases, transfers, child/guardian obligations and operational privacy requests remain host responsibilities. Refusal preserves required site features.

## Cookie Checker and data deletion

Use the local cookie scanner internally during development or an authorized agent audit; never render it as a visitor control. Separately, offer a confirmed data-deletion request for your own website and configured AI/CRM/storage providers. Provider mapping, identity verification, durable jobs and credentials belong to your backend; service detection alone cannot discover or delete a visitor’s provider accounts. See [API examples, limits and host setup](docs/privacy-tools.md). The bundled skill includes matching scanner and deletion integration guidance.

## Updating an existing installation

From the project that uses Web Respect, run:

```sh
npm install web-respect-dpro@latest
```

Review release notes, rebuild and verify cookie consent, withdrawal, accessibility and Feed links locally before deploying. A separately copied agent skill must also be refreshed using the documented skill installer. Updates do not deploy your website automatically.

To review updated skill instructions without overwriting your existing skill:

```sh
npx --no-install web-respect-skill --target .agents/skill-update-review
```

Use a new empty review directory for subsequent updates. Compare its `web-respect` folder with the active skill, preserve your customizations, and replace the active copy after review.
