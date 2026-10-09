# Backend adapters: contract v1

These are optional host-owned reference servers. They collect no IP/user-agent and make no third-party calls. SQLite migrations run on startup. Configure a private database path outside the public web root. Back up and encrypt using the host's operational controls.

All routes require server-to-server `Authorization: Bearer …` and `X-WR-Subject`, a host-established opaque correlation handle. `WR_TOKEN` authorizes choice creation/current reads; a distinct `WR_ADMIN_TOKEN` authorizes privacy deletion/retention. **Never put these tokens in browser configuration.** Browser UUIDs are not identity or authorization. The host gateway must derive subject from its signed session, validate the browser origin/CSRF token, authenticate account access where applicable, and rate limit unauthenticated sessions. Do not trust a browser-provided subject.

Run one adapter with `WR_TOKEN`, `WR_ADMIN_TOKEN`, `WR_POLICY_VERSION`, optional `WR_DATABASE`, `WR_RETENTION_DAYS` (default 180; set to the host's justified retention), and `WR_ORIGIN`. Requests carrying an unconfigured Origin are denied. No CORS wildcard. Loopback/private hosting only; terminate HTTPS at the host gateway. Distributed hosting needs a shared rate limiter: examples limit 60 requests per subject per minute, 8 KiB JSON bodies. Node/Python limiters are process-local; PHP persists rate windows in SQLite. Add proxy-level body/time/concurrency limits for production.

```sh
# Node 22.18+/24 (experimental built-in SQLite)
cd backends/node && npm ci && npm start
# Python 3.12
python -m venv .venv
.venv/bin/pip install -r backends/python/requirements.txt
.venv/bin/uvicorn backends.python.app:app --host 127.0.0.1 --port 4331
# PHP 8.4 with PDO SQLite
php -S 127.0.0.1:4332 backends/php/router.php
```

POST `/v1/consents` appends a choice/update/withdrawal receipt. GET `/v1/consents/current` returns the latest receipt plus current validity. DELETE `/v1/admin/consents` deletes records for the authorized subject. POST `/v1/admin/retention` removes records older than configured retention. Schedule this privileged operation in the host. Audit receipt time is server-generated and distinct from untrusted client choice time. UUID/checkbox is not verified identity, age or a certificate.

Privacy-request integration: verify the requester in the host's established process, resolve its subject handles, call privileged deletion and propagate to each real provider/backend; confirm completion through the host workflow. Toolkit deletion cannot erase data already sent elsewhere. Policy changes invalidate current choices; changing enabled purposes requires a new policy version. Server-side analytics must enforce the same current choices separately.

Errors: 400 invalid request/subject, 401 unauthorized, 403 origin, 404 missing, 413 size, 422 schema/policy/time mismatch, 429 rate limit, 503 PHP storage unavailable. Do not log request bodies/tokens. None of these examples is a full user-identity or age-assurance system.

Laravel route integration is in `php/laravel/`; native Composer/PyPI packages are not published. Go/Java/.NET can implement the same JSON contract and run the shared fixture checks.
