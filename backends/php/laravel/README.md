# Laravel gateway integration

Copy `routes.php` into the host and require it from `routes/web.php`. Configure `services.web_respect.url` to the private loopback PHP/Node/Python adapter and `services.web_respect.token` from a server environment variable. The adapter owns the SQLite migration and receipts. Laravel owns sessions, account authentication, CSRF, throttling and subject mapping. Keep TLS and the host's origin checks at its public boundary. For a remote private adapter, replace the loopback-only configuration validation with a strict host allowlist.

The browser callback can POST its record to `/web-respect/consent` with the host's CSRF token and credentials. Catch non-2xx responses and surface/report delivery failure; never roll back a refusal because receipt logging failed. Withdrawal posts a record with `method: withdrawal` and all optional choices false. Your host must also stop server-side collection.

Copy `WebRespectTest.php` to `tests/Feature/` and run `php artisan test --filter=WebRespectTest`. The test checks authorization and derived subject headers using a mocked adapter; standalone adapter conformance is tested separately. Laravel test mode bypasses CSRF, so verify CSRF in a real HTTP session before production. Privileged deletion/retention belongs in an authenticated host command/worker; no public delete route is included.
