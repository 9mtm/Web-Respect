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

Version: 0.1.0 (initial release candidate). Install from [npm](https://www.npmjs.com/package/web-respect-dpro) with `npm install web-respect-dpro@0.1.0`. Tested versions and limits: [verification](docs/verification.md). The GitHub release tarball can also be installed with `npm install ./web-respect-dpro-0.1.0.tgz`, or build from this repository:

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

Agent skill: `node_modules/web-respect-dpro/skill/web-respect/SKILL.md`. Copy the complete `skill/web-respect` directory into your coding agent's skills directory, or instruct it to read that exact file. This does not require the author's machine or a global skill installation. [Skill](skill/web-respect/SKILL.md) · [Configuration/API](docs/api.md) · [Frontend examples](examples/README.md) · [Backend integration](backends/README.md) · [Regions](docs/regions.md) · [WordPress](examples/wordpress/README.md)

The toolkit supports engineering and compliance work. Installation is not legal advice, verified identity/age, an accessibility repair service or a WCAG/legal certificate. Canvas/3D accessibility, server-side tracking, provider data deletion, notices, lawful bases, transfers, child/guardian obligations and operational privacy requests remain host responsibilities. Refusal preserves required site features.
