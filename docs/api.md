# Configuration and API

## Browser configuration

`mount(target, config)` creates a shadow-root UI and returns controllers and `open('accessibility'|'consent')`, `close()`, `setTheme(dark)`, async `dispose()`. A dedicated content element opts into reversible accessibility effects; body/html are rejected, and the mount must sit outside it. Effects do not overwrite the host's private theme key or `.dark` class. Embedded canvas content and fixed pixel typography may need host work.

`features` selects accessibility/consent. `showLauncher` is `active` (default/source behavior), `always` or `never`; `showBanner: false` allows a host-controlled demo or existing notice. `placement` sets launcher left/right; drawer remains right as in Flowxtra. `zIndex` sets banner/launcher layering; native modal dialogs use the browser top layer. `locale` defaults to the document language, `direction` supports RTL. `messages` overrides flattened labels. Structural source UI labels cover 25 locale variants; new explanatory/withdrawal labels currently have English/Arabic with English fallback. Host legal notices must be translated and reviewed separately; this is not automatic legal translation.

`brand: {name,url,logo}` is optional. `discoverBrand(document)` reads only `img[data-web-respect-logo]` or a declared site icon; review its result before passing it. `policies` includes cookies/privacy/accessibility/sitemap URLs. URLs allow HTTP(S), root-relative or fragments; no javascript/data/file URLs. No logo/font binary is redistributed by default.

Theme precedence: `theme` explicit primary/accent/surface/text/border/radius; `themeVariables` mapping of the same names to actual host CSS variable names; Flowxtra defaults. CSS custom properties: `--wr-primary`, `--wr-accent`, `--wr-surface`, `--wr-text`, `--wr-border`, `--wr-radius`, `--wr-z-index`. Typography inherits from the mount host. `dark` sets initial widget theme; `onThemeChange` delegates light/dark control to the host; without a callback that control is disabled. Call `setTheme` when host theme changes.

`inventory` entries: name/provider/storage/retention/privacyPolicy/category. List only the host's real services. Empty by default. `consent.services` contains unique IDs, optional purpose category and real start(signal)/stop callbacks. SDK teardown must be idempotent. A failed stop is reported through `onError`; the host must fix it before claiming withdrawal works. Runtime state gates starts and aborts pending initializers immediately on withdrawal.

`consent.record` is an optional asynchronous backend callback. `onError` receives storage, SDK or receipt-delivery failures. `consent.policyVersion` invalidates old choices. `ttlMs` defaults to 180 days, configurable up to one year; this engineering default is not a legal retention recommendation. All optional purposes start off. `namespace`, `storageVersion` and injected `storage` isolate versioned settings. Blocked storage retains memory choices for the current mount; a later visit asks again. Cross-tab storage changes refresh both controllers.

## Controllers

Accessibility: `get()`, `update(patch)`, `reset()`, `refresh()`, `subscribe(listener)` returning an unsubscribe function, `dispose()`. Validated text scales 87.5–200%, line-height 1.2/1.5/2/2.5, align left/center/justify and boolean source reading/color controls. Defaults are inert. Host effects handle readable-font spacing, link/focus/structure emphasis, images, motion, reading mask and composable grayscale/contrast. They supplement accessible content; no dyslexia treatment or conformance claim.

Consent: `get()` returns a valid record or null, `allowed(category)`, async `update(choices, method)`, `acceptAll()`, `rejectAll()`, `withdraw()`, `reset()` (withdraws optional choices), `refresh()`, `subscribe(listener)`, `settled()`, `receiptsSettled()`, async `dispose()`. Essential remains true. Expired/version-mismatched data fails closed. A choice is not identity/age verification. Changes/withdrawal append receipts via the callback. No public deletion endpoint or third-party network calls are generated.

Footer: `mountFooter(element, toolkit, {locale, accessibilityLabel, consentLabel, mcp, feed, discoverLinks})` returns a remover. Buttons use the original Flowxtra inline SVGs. Discovery reads declared `<link rel="mcp" href="/mcp/">` and RSS/Atom/JSON alternate links; it makes no requests and does not guess an API. MCP/Feed are visible links only, not a built-in MCP server or feed generator.

## Migration

Changing policy/storage version fails closed. For existing Flowxtra accessibility settings, read the old key once and pass it through `validateAccessibility`, then `update` under the new namespace. Do not copy Flowxtra consent as proof of current consent: inventory/purposes/policy may differ. Ask again for optional purposes unless the host independently establishes equivalent, unexpired choices and documents the migration. No automatic migration silently enables tracking.
