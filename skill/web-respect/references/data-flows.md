# Service discovery and data-flow evidence

## Inspect actual collection

Read manifests, imports, HTML scripts/iframes, tag-manager configuration, CMS plugins, consent callbacks, middleware, routes, webhooks, workers, queues, database schemas, IaC/deployment settings and logging configuration. Inspect secret variable names or redacted settings rather than printing values. A dependency or URL is a candidate service, not proof of active collection.

Use clean synthetic browser sessions to compare initial load, refusal, individual categories, acceptance, withdrawal, reload, signed-in/out states, embedded media and checkout/support flows. Inspect network initiators, cookies including server Set-Cookie, local/session storage, IndexedDB, service workers and caches. Query backend configuration/log metadata with authorized access. Browser observations cannot expose all server-to-server calls; source alone cannot establish production behavior.

Cover analytics/ads and tag managers, hosting/CDN/WAF/DNS, databases/object storage/backups, email/SMS, payments, support/chat/CRM, maps/video/fonts/CAPTCHA, auth, crash reports/logs, consent receipts, push notifications and AI model/vector/observability providers. Trace aliases, proxies and first-party forwarding; a same-origin endpoint can relay to a third party. Note MCP/feed endpoints only if actually declared and assess access/contents separately.

## Evidence inventory

One record per active purpose/data flow, with:

| Field | Evidence needed |
| --- | --- |
| Service and legal entity | Package/plugin plus observed call or backend configuration; controller/processor role |
| Activation and purpose | Trigger, required/optional justification, consent category or applicable opt-out |
| Data | Field categories, identifiers, content/attachments, inferred/sensitive data, user groups |
| Origin and path | Browser/API/job source, recipients, onward processors, queues and persistent copies |
| Processing locations | Tenant-selected compute/storage regions, replicas, backup, telemetry and support-access countries |
| Contracts and safeguards | DPA, subprocessor list, transfer mechanism where required, access controls and review date |
| Retention | Actual tenant setting, TTL/job, purpose/end trigger, backups and provider deletion behavior |
| Rights and stop behavior | Withdrawal/opt-out propagation, subject mapping, export/correction/deletion interface |
| Confidence | Observed, configured, owner-declared, provider-documented, inferred, unknown; dated evidence |

Do not infer data residency from DNS/IP geolocation, provider headquarters, billing address or a nearby CDN point of presence. Regional hosting does not prove all support, telemetry, subprocessors or backups remain there. Provider marketing is not evidence of this account's enabled options. If configuration/contracts are inaccessible, ask for a redacted region/retention setting or mark unknown.

AI flows require separate checks for prompts, attachments, embeddings/vector stores, generated output, abuse logs, evaluation datasets, training opt-in/out, human access, tenant retention exceptions and deletion propagation. An AI provider's general no-training statement does not prove zero retention. An AI SDK dependency does not by itself determine EU AI Act classification or conformity.

Build a simple source-to-recipient map and reconcile policy promises against observed flow/configuration. Never upload real user records, secrets, private paths or contracts into a public report. Record reproducible metadata and redacted evidence references.
