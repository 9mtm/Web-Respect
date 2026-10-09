# Verification — 0.1.0

Verified on 9 October 2026. This initial release is not a WCAG or legal compliance certificate.

## Distribution

Source/releases: https://github.com/9mtm/Web-Respect. The kit includes `web-respect-dpro-0.1.0.tgz` and a WordPress plugin ZIP. The owner completed npm publication after the initial kit verification: [web-respect-dpro 0.1.0](https://www.npmjs.com/package/web-respect-dpro). Install with `npm install web-respect-dpro@0.1.0`. Composer/PyPI distributions are unavailable. The original GitHub tarball retains the initial pre-publication status report; this document records the later registry verification. The bundled skill is `skill/web-respect/SKILL.md` in both repository and installed package.

| Integration | Tested version | Result |
| --- | --- | --- |
| Core / HTML | TypeScript 5.9.3, Node 24.2.0 | Build/check and 11 behavior tests passed; SSR import, validation, expiry/policy refusal, SDK abort/stop/reaccept, receipt ordering and shared entrypoints |
| React | 19.2.0 | Browser fixture built; dialog and consent controls exercised |
| Next | 16.4.0 / React 19.2.0 | Static SSR/hydration build passed; hydrated dialog and Escape exercised |
| Astro | 7.3.4 | Static build passed; mounted browser dialog exercised |
| Angular | 20.3.33 | JIT browser fixture with CUSTOM_ELEMENTS_SCHEMA built and exercised |
| Vue | 3.5.43 | Browser fixture built; dialog and consent controls exercised |
| Svelte | 5.57.2 | Browser fixture built; dialog and consent controls exercised |
| WordPress | 7.1.3 / PHP 8.4 | Actual plugin activated in isolated Playground; footer controls, declared feed and scoped text scaling exercised |
| Node backend | Express 5.1.0 / Node 24.2.0 | Shared contract conformance passed |
| Python backend | FastAPI 0.115.12 / Uvicorn 0.34.2 / Python 3.12.10 | Shared contract conformance passed |
| PHP backend | PHP 8.4.23 / PDO SQLite | Shared contract conformance passed |
| Laravel gateway | Laravel 13.35.0 / PHP 8.4.23 | Two gateway tests / five assertions passed in isolated application |
| Dpro product page | Astro 7.3.4 | Site check/build passed and live demo reviewed |

Backend fixtures cover invalid choices, append/update/withdrawal receipts, receipt time, current state, subject isolation, auth, forbidden origins, size/rate limits and privileged deletion/retention. To rerun: `npm ci --prefix backends/node`, install `backends/python/requirements.txt` into a test virtual environment, provide PHP with PDO SQLite, then run `node scripts/backend-conformance.mjs` from the kit root. Set `WR_TEST_PYTHON` to your interpreter if needed. Ports 4330–4332 must be free. The checker uses local temporary databases and test-only credentials. Production session/CSRF configuration remains host work.

## Browser and visual evidence

Testing used the Codex in-app Chromium browser. HTML refusal left capture stopped; explicit Performance acceptance started it; withdrawal stopped it and returned focus to its opener. Escape and keyboard dialog navigation passed. Effects did not write host root inline styles. Arabic RTL was checked. A real 390 × 844 iframe fixture exercises narrow-screen layout; browser-wide viewport override did not change actual page dimensions and is not reported as mobile-device coverage.

`docs/screenshots/` contains public-page-only captures without desktop chrome or private files. Flowxtra desktop baselines preserve the drawer/consent structure; toolkit captures include the narrow Arabic fixture and WordPress. Additional source captures are references, not verified mobile-device baselines. Host typography, configurable legal text and service inventory prevent a claim of pixel identity across hosts.

Independent Codex review prompted fixes for long expiry timers, asynchronous SDK teardown, rapid reaccept, receipt ordering, shared ESM state, remounts and package exclusions. Final core recheck passed 11 tests. Source/package scans exclude local task/handoff files, machine paths, credentials, env files, databases, bytecode, caches and nested dependencies. Root audit reported zero known vulnerabilities at verification time; it is not a security guarantee.

## Limits

Only the versions/browser above were exercised. Production Angular SSR, real mobile devices, Safari/Firefox, every navigation system and provider-specific trackers require host testing. Remount fixes have core tests and independent code review. An SDK that ignores abort may delay disposal until startup finishes; stop callbacks must be idempotent.

Structural translations cover 25 locale variants; new explanatory/withdrawal text uses English/Arabic with English fallback. Legal notices require separate translation/review. MCP/Feed expose declared host links only. WordPress does not automatically gate trackers from unrelated plugins. Effects cannot repair canvas/3D semantics. Icon/licence boundaries are documented in `provenance.md`.
