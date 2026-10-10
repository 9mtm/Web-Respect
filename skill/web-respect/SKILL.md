---

name: web-respect

description: Audit privacy, consent, accessibility and service/AI data flows; integrate site-wide Web Respect controls and prepare owner-approved public feeds, sitemaps, llms.txt and technical SEO improvements.

---



# Web Respect audit and integration



Support evidence-based audits and implementation. An audit is an agent workflow using available repository, browser, infrastructure and documentation tools; this skill is not an autonomous scanner, legal certification service or a promise to cover every law. Keep each finding tied to an observed implementation and a dated primary source. Report unknowns explicitly. Do not turn an audit-only request into permission to change production, contact vendors or delete records.



## Establish scope before choosing rules



Read [applicability](references/applicability.md) first for an audit. Ask the owner for missing facts in small batches: legal entity and establishments; countries and US states where customers are actively targeted and actually served; consumer/business/public-sector context; children and sensitive data; business size and relevant processing volumes; production URLs and environments; access to hosting/provider settings; and whether the request is review, implementation, or both. Use facts already provided instead of asking again. Inspect public/source evidence while awaiting answers; dependent applicability conclusions stay provisional.



Website language, visitor IP, a country selector, CDN endpoint or server location alone does not prove applicability or an exemption. An owner targeting only one market still needs analysis of establishment, actual processing, other customers and sector rules. Preserve a dated applicability matrix with reasons, sources and unresolved facts. For an unlisted country, research its regulator and legislation before advising; do not inherit a different country's profile.



## Audit routes



- Read [technical SEO](references/seo.md) for crawling, indexing, metadata, language routes and structured data.

- Read [public feeds and discovery](references/discovery.md) for every website audit or integration. Feed, Sitemap and root robots.txt are a required workflow step.



- Read [data flows](references/data-flows.md) to discover real browser/server services, SDKs, plugins, AI providers, subprocessors, deployment regions and transfers. Require tenant configuration evidence for region and retention claims.

- Read [privacy operations](references/privacy-operations.md) for storage/consent, retention, requests, deletion propagation, restore handling and operational controls.

- Read [cookie checker and deletion integration](references/privacy-tools.md) when adding a scanner or a visitor data-deletion button. Use the actual package APIs and configure provider routing from verified server data flows.

- Read [accessibility audit](references/accessibility-audit.md) to scope applicable obligations and perform automated plus manual evaluation of actual user journeys.

- Read [audit report](references/audit-report.md) to produce findings, evidence, a market-specific action plan and unresolved decisions. Audit artifacts are private by default; publish only sanitized output within the owner's authorized scope.



Use [regional sources](references/regional-sources.md) as research starting points, not frozen legal rules. Verify current law, regulator guidance, effective dates, amendments, exemptions and national/state implementation on the audit date. Distinguish binding obligations, regulator recommendations and engineering defaults. Record the exact source section and access date; if access fails, state what could not be verified. Route sector-specific, child, biometric, health, financial, employment and AI classification questions to separate sourced analysis instead of marking them covered by a cookie review.



## Integrate or remediate within the requested scope



Web Respect is a general toolkit for any host project. When asked to set up privacy or deletion handling, inspect the project you are working in and discover its actual browser/server services, including AI providers. Prepare the host endpoint, provider registry, subject mappings and adapters using the package APIs; do not ask the owner to select a separate first website or manually enumerate services you can establish from evidence. Ask only for material configuration/access facts that remain unavailable. Follow [cookie checker and deletion integration](references/privacy-tools.md) for discovery-to-integration steps and report each adapter as tested, awaiting configuration, manual or unsupported.



Read the host's instructions, package versions, frontend client/SSR boundaries, backend routes/session conventions and existing dirty state before edits. Inventory real trackers, SDK initialization, cookies/storage and server-side data flows. Do not infer service inventory from the demo or Flowxtra. Preserve unrelated work and the owner's publication scope.



Read [integration](references/integration.md) for mount/theme/footer/lifecycle choices; [backend](references/backend.md) when server receipts are requested; [verification](references/verification.md) before reporting implementation completion. Audit references are self-contained in the skill download. For implementation, locate the distributed package's README, docs/api.md and backend files in the host's installed package or checked-out Web Respect repository. If only the standalone skill is present, read those files at https://github.com/9mtm/Web-Respect before making API decisions; do not invent missing files or resolve paths against an author's machine.



Choose `/accessibility`, `/consent`, `/browser` or optional `/react` based on actual needs. The browser module imports safely in SSR; call mount/register after client hydration. Use a stable config in React and await disposal during host lifecycle changes. Effects require a content element outside the widget mount. Map actual host CSS variables, locale/direction, policy links, namespace and policy version. Widget attribution is a text-only Dpro link below Withdraw optional consent only while About Cookies is selected; do not display host logos or names in the widget. Host themes change through callbacks; never rewrite the site's private theme storage.



For optional SDKs, remove prior unconditional initialization and implement actual start/stop behavior. Abort pending work, disable capture and queues on withdrawal. Required features must remain usable on refusal. Backend delivery failures cannot grant consent. Browser IDs, checkboxes and receipts are not verified identity, guardian authorization or certificates.



Use the applicability matrix to configure actual requirements. Separate lawful bases for processing from terminal-device consent and US sale/sharing or targeted-advertising opt-outs. Test applicable privacy signals in the host and downstream services; the toolkit has no built-in universal GPC handler. Never promise universal compatibility, legal compliance or WCAG conformance from installation.



Use the package's source-preserving UI and existing framework examples. Add optional declared MCP/feed links only when the host actually provides them. Keep code/docs/comments in the project's required language; localized UI dictionaries are separate content. WordPress plugin configuration cannot stop arbitrary tracker plugins without real integration.



For site-wide integration, mount consent once in the shared layout on every public route. Put a cookie-settings button with a cookie icon beside the accessibility control in the common footer; localize both labels and dialogs for every host language. Wire refusal and withdrawal to actual optional service start/stop behavior. Verify first visit, persisted choice, reopen, navigation and both language versions. Deploy when the owner has authorized deployment, then check live routes; do not report publication based only on a local build.



Upgrade: back up settings, change policy version when purposes/inventory change, validate old accessibility settings and ask again rather than silently migrate old Flowxtra consent. Report actual tested versions, failures, external credential blockers and unsupported integrations. Do not publish private paths, host secrets, local task/handoff files or sensitive fixtures.


## Required Feed, Sitemap and robots.txt step

For every website integration, complete a public Feed hub, Sitemap and site-root robots.txt step. Inspect existing routes, CMS publication flags, canonical URLs, sitemap indexes and crawler rules first. Ask which public content, categories, languages and summaries the owner wants published and what must be excluded; reuse answers already provided. Preserve working feeds, sitemap indexes and robots rules. Integrate missing pieces through the host framework/CMS without conflicting replacements. When robots.txt is absent, establish and review the intended crawler policy with the owner before passing it through `robotsTxt`; never silently allow every route. A merge snippet alone is not a completed integration.

Connect the reviewed Feed hub to the footer and `policies.feed`; add alternate links for available feeds to the HTML head. Ensure root robots.txt references the actual sitemap/index. Verify all three resources, MIME types, canonical links and publication exclusions before authorized deployment, and check live responses afterward. For audit-only work, inspect and report findings and a plan instead of publishing. Missing publication choices, hosting access or deployment remain explicit pending items; do not mark setup complete or expose guessed content. This is a Web Respect workflow requirement, not a universal legal obligation. Package installation never automatically publishes content.

Preparing or updating an accessibility statement is a required integration step. Read [accessibility statement](references/accessibility-statement.md), inspect existing statements and use its bundled template with verified audit facts. Ask for missing contact, scope and assessment details; preserve host routes and styling. Legal obligations depend on public/private scope, covered services, exemptions and national rules, not European location alone. Configure the real Statement route beside Feed in the drawer footer. Only the statement page gets a small text-only Powered by Dpro link; the drawer gets no branding.
