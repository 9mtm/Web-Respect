# Release procedure

1. Read local task/handoff privately and preserve unrelated repositories. Never include local absolute paths, credentials, databases, bytecode, caches or task files in public content.
2. Run build/check/core behavior tests, framework builds and browser verification, shared backend fixtures and host-specific tests. Record exact versions and meaningful limitations in verification.md.
3. Run skill validation, dependency/license inventory and independent review. Fix concrete findings; do not certify legal/WCAG compliance.
4. Run npm pack and inspect every file. Confirm the skill, docs, contract and backend sources are included; nested node_modules, __pycache__, local source inventories and env files are excluded. Scan textual contents for private paths/secrets.
5. Build the WordPress ZIP with its local prebuilt browser asset. Prepare checksums and the changelog. No Composer/PyPI package is advertised.
6. Reverify personal GitHub account and the actual existing repository. Push only reviewed public source. Publish a versioned release with tarball/WordPress ZIP and truthful support scope.
7. Publish npm only with authorized credentials and any registry-required owner step. A registry authentication blocker does not block GitHub tarball distribution. Never create fake package links.
8. Build/verify the existing Dpro Astro product page and use its existing cPanel deployment workflow. Verify actual public URLs after publication.

Local TASK.md/HANDOFF.md are excluded from source and package publication. Public verification reports use portable repository-relative paths.
