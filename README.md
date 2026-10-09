# Web Respect

<p>
  <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/gdpr-dsgvo.png" alt="Owner-declared DSGVO and GDPR compliance" height="34">
  <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/eu-ai-act.png" alt="Owner-declared EU AI Act compliance" height="34">
</p>

Owner-declared compliance statements; not independently certified. Applicability and compliance depend on the host deployment. See [regional guidance](docs/regions.md).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: initial release](https://img.shields.io/badge/status-initial_release-blue.svg)](docs/verification.md)
[![npm](https://img.shields.io/npm/v/web-respect-dpro?label=npm)](https://www.npmjs.com/package/web-respect-dpro)

Accessibility preferences and consent controls extracted from the owner-authorized Flowxtra drawer/banner design. A framework-neutral TypeScript core, isolated browser UI, optional React wrapper, bundled agent skill and optional Node/PHP/Python consent adapters. No tracker, external endpoint, Flowxtra service inventory or host theme mutation is enabled by default.

Source: https://github.com/9mtm/Web-Respect

<p><img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/nodedotjs.svg" alt="Node.js" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/react.svg" alt="React" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/astro.svg" alt="Astro" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/svelte.svg" alt="Svelte" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/vuedotjs.svg" alt="Vue" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/nextdotjs.svg" alt="Next.js" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/wordpress.svg" alt="WordPress" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/angular.svg" alt="Angular" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/python.svg" alt="Python" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/typescript.svg" alt="TypeScript" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/php.svg" alt="PHP" height="24"> <img src="https://raw.githubusercontent.com/9mtm/Web-Respect/main/docs/brand/integrations/html5.svg" alt="HTML" height="24"></p>

Tested frontend integrations and optional backend runtimes; exact versions are listed in [verification](docs/verification.md).

Release kit: 0.2.0 (expanded audit skill and explicit-target installer; browser/backend runtime unchanged from 0.1.0). The previously verified npm release is 0.1.2; check the [registry](https://www.npmjs.com/package/web-respect-dpro) before assuming 0.2.0 is available there. Install the new kit from its [GitHub release](https://github.com/9mtm/Web-Respect/releases/tag/v0.2.0) with `npm install ./web-respect-dpro-0.2.0.tgz`, or build from this repository. Tested runtime versions and limits: [verification](docs/verification.md).

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
  brand: {name: 'My site', logo: '/logo.svg'},
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

Agent skill path: `node_modules/web-respect-dpro/skill/web-respect/SKILL.md`. Copy the complete folder including references, or download [the standalone skill ZIP](https://github.com/9mtm/Web-Respect/releases/download/v0.2.0/web-respect-skill-0.2.0.zip). Extract its `web-respect` folder into your agent's skills directory. The audit references work separately; implementation also needs the package API/backend documentation linked by the skill.

After installing the 0.2.0 kit, install into a project-local agent skills directory:

```sh
npx --no-install web-respect-skill --target .agents/skills
```

For an agent that uses another location, supply that directory explicitly. The installer only copies the skill; it never overwrites an existing `web-respect` entry, installs trackers, changes the host application or contacts providers. It needs Node 22 or newer. If installation fails after creating a new folder, inspect that partial folder before retrying.

Ask your coding agent:

> Use $web-respect to audit this project. Ask for missing company and market facts first. Inspect real services, privacy choices, accessibility, processing locations, retention and deletion. Verify current official sources. Produce an evidence-based action plan, mark unknowns and keep private information out of public output. Start with a review.

[Configuration/API](docs/api.md) · [Frontend examples](examples/README.md) · [Backend integration](backends/README.md) · [Regions](docs/regions.md) · [WordPress](examples/wordpress/README.md)

The toolkit supports engineering and compliance work. Installation is not legal advice, verified identity/age, an accessibility repair service or a WCAG/legal certificate. Canvas/3D accessibility, server-side tracking, provider data deletion, notices, lawful bases, transfers, child/guardian obligations and operational privacy requests remain host responsibilities. Refusal preserves required site features.
