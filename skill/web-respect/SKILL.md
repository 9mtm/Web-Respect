---
name: web-respect
description: Install, configure, upgrade or verify the Web Respect accessibility and consent toolkit in a host frontend/backend, including WordPress and optional consent receipts.
---

# Web Respect integration

Read the host's instructions, package versions, frontend client/SSR boundaries, backend routes/session conventions and existing dirty state before edits. Inventory real trackers, SDK initialization, cookies/storage and server-side data flows. Do not infer service inventory from the demo or Flowxtra. Preserve unrelated work and the owner's publication scope.

Read [integration](references/integration.md) for mount/theme/footer/lifecycle choices; [backend](references/backend.md) when server receipts are requested; [verification](references/verification.md) before reporting completion. The distributed package's README and docs/api.md are the API source of truth. Locate them relative to this skill's package root, not an author's absolute path.

Choose `/accessibility`, `/consent`, `/browser` or optional `/react` based on actual needs. The browser module imports safely in SSR; call mount/register after client hydration. Use a stable config in React and await disposal during host lifecycle changes. Effects require a content element outside the widget mount. Map actual host CSS variables, explicit brand/logo, locale/direction, policy links, namespace and policy version. Host themes change through callbacks; never rewrite the site's private theme storage.

For optional SDKs, remove prior unconditional initialization and implement actual start/stop behavior. Abort pending work, disable capture and queues on withdrawal. Required features must remain usable on refusal. Backend delivery failures cannot grant consent. Browser IDs, checkboxes and receipts are not verified identity, guardian authorization or certificates.

Choose jurisdiction guidance from docs/regions.md and verify current primary sources for the host's applicability. State unresolved notices, transfers, age/guardian requirements and operational privacy obligations. Never promise universal compatibility, legal compliance or WCAG conformance from installation.

Use the package's source-preserving UI and existing framework examples. Add optional declared MCP/feed links only when the host actually provides them. Keep code/docs/comments in the project's required language; localized UI dictionaries are separate content. WordPress plugin configuration cannot stop arbitrary tracker plugins without real integration.

Upgrade: back up settings, change policy version when purposes/inventory change, validate old accessibility settings and ask again rather than silently migrate old Flowxtra consent. Report actual tested versions, failures, external credential blockers and unsupported integrations. Do not publish private paths, host secrets, local task/handoff files or sensitive fixtures.
