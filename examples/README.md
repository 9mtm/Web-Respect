# Frontend fixtures

Run `npm ci && npm run build && node scripts/build-examples.mjs`, then `node scripts/preview.mjs` from the repository root. Open `/examples/html/index.html`, `/examples/react/index.html`, `/examples/vue/index.html`, `/examples/angular/index.html`, `/examples/svelte/index.html` on port 4328. Each fixture mounts actual toolkit controls and disposes through the framework lifecycle.

Next: `cd examples/next && npm run build` produces a real static SSR/hydration build. Astro: `cd examples/astro && npm run build` produces a real static build. Dependencies resolve from the root development install; for a standalone host install the versions in docs/verification.md and import the published package entrypoint instead of relative dist paths. Serve built `out/` or `dist/` through an HTTP server and test browser controls.

These minimal fixtures establish integration behavior on the tested versions; they do not claim all framework releases, browsers or navigation libraries work universally. Angular fixture uses explicit custom-element registration and CUSTOM_ELEMENTS_SCHEMA. Its JIT test build uses esbuild; production hosts should use their own Angular build/SSR boundary. Vue/Svelte mount from their lifecycle hooks. React config is stable and cleanup awaits toolkit lifecycle where the host permits it.

Reference boundaries: [Next client components](https://nextjs.org/docs/app/api-reference/directives/use-client), [Astro client scripts](https://docs.astro.build/en/guides/client-side-scripts/), [Angular custom-element schema](https://angular.dev/api/core/CUSTOM_ELEMENTS_SCHEMA), [Vue web components](https://vuejs.org/guide/extras/web-components.html), [Svelte lifecycle](https://svelte.dev/docs/svelte/lifecycle-hooks).

[WordPress plugin](wordpress/README.md) is a separate PHP/JS host integration, included in the release kit.
