# Cookie Checker and data deletion requests

Web Respect is a free, MIT-licensed cookie banner, accessibility and privacy toolkit developed by Dpro. The Cookie Checker / Cookie Scanner runs a local snapshot on demand. Privacy controls let visitors submit a request to the host's configured workflow. These features require Web Respect 0.3.0 or newer; they do not exist in the older 0.1.2 browser bundle.

## Let your coding agent prepare the integration

Use the bundled Web Respect skill in any website/application project. The agent inspects SDKs, server routes, configuration, CMS plugins, database/storage use and AI data flows to discover actual services. It then prepares the site's protected request endpoint, provider registry, subject mappings and deletion adapters using this package. It checks official provider documentation, tests with synthetic subjects and identifies missing configuration or manual/unsupported provider paths.

The skill does not require a predetermined website or a fixed list of AI vendors. The current project's evidence drives configuration. Browser cookie scanning is one input; server-side AI providers may require source and tenant-settings inspection. Provider connectors are generated/adapted in the host project rather than automatically enabling every service on every installation. This workflow prepares the integration; production request execution still requires the host's verified user request and configured credentials.

## Local discovery

```ts
import {scanCookies} from 'web-respect-dpro/scanner';
const report = scanCookies(document);
```

Reports contain visible cookie names, local/session storage key names, resource hostnames and evidence for possible service matches. Cookie values are discarded; storage values are never accessed. Resource paths, query strings and fragments are excluded. There are no network calls, writes, automatic remediation or automatic uploads. Key names can themselves contain personal data, so keep reports local or review/redact before sharing.

Default signatures cover possible Google Analytics, Google Tag Manager and Meta Pixel use. Add host-specific `rules` with `id`, `name`, `domains`, `cookiePrefixes` and `storagePrefixes`. Domain matches require an exact host or a subdomain; matching evidence is not proof of actual processing. Empty results do not mean a site is tracker-free. Blocked storage is reported as unavailable.

The snapshot cannot see HttpOnly cookies, storage on other origins, server-to-server tracking or private AI API calls. Combine it with repository/configuration review and browser network testing before deciding the real inventory. See [MDN's cookie API limitations](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).

## Visitor controls

```ts
import {mount} from 'web-respect-dpro/browser';
const toolkit = mount(widgetRoot, {
  privacy: {
    // Host callback: use your existing authenticated/session-aware request flow.
    requestDeletion: async () => {
      const response = await fetch('/api/privacy/deletion-requests', {
        method: 'POST', credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken},
        body: JSON.stringify({action: 'request-deletion'})
      });
      if (!response.ok) throw new Error('Request not accepted');
      return response.json(); // {requestId, status: 'pending'}
    }
  }
});
```

The consent dialog gets a scanner and a deletion-request button. `privacy: {}` enables the scanner alone. `mountPrivacyControls(element, options)` can also render standalone controls. The visitor must confirm submission; clicking the first button sends nothing. English labels are defaults; translate all `labels` through host configuration. Failures show a retry/contact message. No callback means no deletion button, network traffic or invented service endpoint. Closing/unmounting removes controls; a request already accepted by the server is not cancelled by navigation.

The endpoint above is a host implementation, not supplied by the package. Resolve identity from your own session/verification flow, never a browser-supplied email or subject ID. Validate request shape, origin and CSRF, enforce body/rate limits and persist a durable request before acknowledging it. Return a receipt without personal identifiers. A verified request may still need scoped retention exceptions. Withdrawal and deletion are separate operations; deletion requests must also address future collection in the host's actual workflow.

## Server/provider orchestration

```ts
import {dispatchDeletion} from 'web-respect-dpro/privacy';
// Inside your authenticated worker; never in the browser bundle:
const results = await dispatchDeletion({requestId: job.id, subjectId: job.subjectId}, {
  authorize: async context => verifyApprovedJob(context),
  providers: await resolveProvidersForSubject(job.subjectId),
  record: async (context, result) => persistProviderStatus(context, result)
});
```

The host's `resolveProvidersForSubject` must return the site's own data-store adapter plus actual configured AI/CRM/analytics/storage adapters relevant to this subject. Each has a unique `id` and `requestDeletion(context)` callback. Subject-to-provider account/resource mappings and credentials remain server-side. Scanned domains never become destinations, arbitrary email recipients or deletion API URLs.

`dispatchDeletion` authorizes first, persists pending intent before each callback, then records `pending`, `completed`, `restricted` or `failed` for that provider. A failed callback does not prevent later providers from running. A persistence failure stops dispatch; the host must recover through its durable worker. Do not return `completed` merely because a vendor accepted the request. Use `pending` until provider acknowledgement/verification confirms actual removal, and `restricted` for a documented exception.

This is an orchestration helper, not a durable queue or a built-in vendor integration. Implement a per-request worker lock and idempotent provider callbacks keyed by `requestId + providerId`; persist provider resource mappings and checkpoints, skip already completed jobs, reconcile ambiguous network outcomes and retry only unfinished work. Verify provider-specific deletion APIs, tenant permissions and retention behavior before enabling each adapter. Where no API exists, queue an approved manual workflow instead of claiming automatic deletion. Do not retain erased content in audit records. Handle backups, restores, queues and legal holds in the host application.

Never put vendor keys in the browser. Test with synthetic subjects: unauthorized requests produce no calls, one subject cannot delete another's records, duplicate delivery is safe, provider failure stays visible, legal holds stay scoped, and provider acceptance remains pending. Package tests verify generic dispatch and scanner behavior; they do not verify any real provider integration.
