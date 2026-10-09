# Frontend decisions

Inspect the installed framework and read examples/README.md. Configure `mount` in a client lifecycle; call dispose on unmount/navigation. Register custom elements explicitly; set `.config` before connection. Angular declares CUSTOM_ELEMENTS_SCHEMA, Vue/Svelte can use the ordinary mount API. The optional React component has a `use client` boundary; memoize config/onReady to avoid needless reinitialization.

Set host policy routes and real service inventory. Default service lists are empty. Brand/logo can be supplied explicitly; discoverBrand only reads a marked logo or declared icon. Do not scrape arbitrary logos or copy third-party assets without provenance. Footer controls use mountFooter and its remover; MCP/feed links must be real declared resources. Match host locale and RTL, supply missing localized explanatory/withdrawal labels through messages.

Theme precedence is explicit config, mapped host CSS variables, Flowxtra defaults. Do not guess every site's arbitrary color naming. Keep the widget outside the effects target; defaults must not overwrite root font/theme settings. Check no layout overflow, contrast, large text, keyboard and reduced motion against the actual host.
