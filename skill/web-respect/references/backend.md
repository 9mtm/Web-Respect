# Backend decisions

Read backends/README.md and contract/consent.schema.json. Choose the detected runtime; npm distributes reference source and does not execute PHP/Python. Adapt migrations, persistence, auth/session, CSRF/origin, rate/body limits, privacy requests and retention to the host.

Adapter bearer/admin tokens stay server-side. A gateway derives a subject from authenticated identity or a signed anonymous session; never accept a browser UUID as authority. Distinguish untrusted clientTime from server receivedAt. POST records creates/updates/withdraws choices; privileged delete/retention is host worker/admin work. Propagate withdrawal and deletion to real backend/providers. Test shared fixtures with scripts/backend-conformance.mjs and the host's real session security.

Keep raw request bodies, IP/UA, secrets and personal data out of logs by default. Configure retention intentionally; receipt expiry and audit retention are different. For Go/Java/.NET extensions implement the same contract and run equivalent conformance fixtures; do not claim an adapter already exists.
