# Consent, retention and privacy-request operations

## Storage and choices

Classify each purpose from actual behavior. Do not label optional measurement, ads or personalization necessary because a vendor/plugin says so. Examine pixels, fingerprinting, local storage, SDK identifiers and server events as well as cookies. Match disclosures to data, vendors, duration and applicable rules. Separate purpose-specific processing bases from device-storage consent. Preserve required functionality on refusal and an accessible way to reopen choices.

Verify optional services do not initialize or send prohibited events before permission; refusal and granular choices work; withdrawal disables capture, pending initialization, queues, background work and future server forwarding; new purposes/policy versions ask again; expiry, cross-tab and blocked storage are handled. Test reloads and authenticated sessions. Cookie removal alone cannot undo earlier disclosure. SDK shutdown does not automatically delete provider records.

For applicable US regimes, inspect sale/sharing, targeted advertising, sensitive-data rules, authorized-agent requests, appeals and recognized universal opt-out signals. Test browser and server handling, including Sec-GPC where available, precedence, persistence and downstream propagation. Do not treat Do Not Track as identical to GPC or convert opt-out into a universal ban on every necessary request. Web Respect requires host implementation for these signals; flag missing handling rather than claim built-in coverage.

## Retention and minimization

Build a schedule per dataset: owner, purpose, data categories, processing basis, start/end trigger, justified duration or documented criterion, legal hold/exception, storage locations, cleanup mechanism, provider lifecycle and verification evidence. No universal retention period exists. Do not invent 30/90 days or apply cookie expiry to server records.

Inspect database TTLs, scheduled cleanup, blobs, queues/dead-letter queues, CDN/cache, logs, exports, search indexes, AI/vector stores, replicas and backups. Confirm jobs actually execute and fail visibly. Distinguish account closure, consent expiry/withdrawal and data deletion. Describe when inaccessible backup copies age out and how restores reapply deletion restrictions before serving data. Keep hold scope narrow and document release/review. Pseudonymization is not necessarily anonymization.

## Rights workflow

Inspect the existing authenticated request API/help channel and adapt to host conventions. Do not expose an anonymous endpoint that deletes records based on a supplied email/UUID. Use proportionate verification, authorized-agent checks where applicable, subject isolation, CSRF/origin and rate/body limits, privileged jobs and minimal audit metadata. Do not collect ID documents by default. Separate requests that require identity verification from opt-outs that must not be obstructed by inappropriate verification.

Map applicable access/export, correction, deletion, consent withdrawal, restriction/objection, portability, sale/sharing/advertising opt-out and appeal rights. Read the current source for deadlines, permissible extensions, exceptions, fees and response content for each right/jurisdiction; do not reuse GDPR timing globally. Record received time, applicable deadline basis, owner, status, exceptions/reasons and completion evidence without retaining the erased content.

Deletion propagation: identify subject references across primary tables, linked accounts, events, files, queues, logs, caches, indexes, AI stores and each processor; enqueue idempotent jobs; track partial failures and retry safely; stop renewed collection; apply documented legal-hold exceptions; request provider deletion and record acknowledgement; prevent restores/replays from resurrecting deleted data. A consent-receipt adapter's delete endpoint covers receipts only, not the host's entire customer record.

Test on isolated synthetic subjects: one user's request cannot affect another; repeated deletion is safe; unauthenticated/forged requests fail; export excludes other subjects and secrets; provider failure remains pending; hold exceptions produce a reason; restored backups respect restrictions. Implementing a worker does not authorize running destructive deletion against real users.

## Related operational gaps

Review privacy notices against actual flows, processor contracts/transfers, children/sensitive data, breach-response ownership, restricted administrative access and high-risk assessment triggers. Flag separate legal decisions and missing evidence. Do not declare a system compliant because its banner, DPA link or badge exists.
