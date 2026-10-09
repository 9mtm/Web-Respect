# Architecture

Versioned TypeScript controllers own state, validation and service lifecycle. Browser storage is injected, with memory fallback and event-driven synchronization. No DOM access at module evaluation.

Framework-neutral browser renderer mounts into a shadow root; scoped prebuilt CSS preserves the source layouts and inline SVG icons. Accessibility effects are opt-in on a configured host content element and disposed reversibly. Dialogs trap/restore focus, isolate the background and support Escape and RTL. Theme configuration overrides mapped host variables then Flowxtra colors; host theme changes go through a callback.

Consent starts with essential only. Host services supply start/stop callbacks, serialized across choices, expiry and disposal. No tracker or remote endpoint is included by default. Optional backend delivery is a host callback with observable failures.

One backend-neutral v1 schema and fixtures cover receipts, policy version, choices, expiry, withdrawal and privileged retention/deletion. Node, PHP and Python run independently. Browser identifiers are correlation handles, never verified identity.

Release gate: behavior tests, source visual comparison, tested framework fixtures, backend conformance, packed skill/docs, independent review, truthful Astro product page and real publication identifiers.
