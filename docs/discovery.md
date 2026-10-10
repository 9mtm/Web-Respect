# Public feeds and discovery

Recommend a branded, accessible `/feed/` page alongside site-wide consent and accessibility controls. The owner chooses public categories, exact content, exclusions, languages and summaries. This is a publication workflow, not a privacy scanner or automatic crawler.

```sh
npx web-respect-feed --config discovery.config.json --output discovery-review
```

Use `examples/discovery.config.json` as a template. Explicit `publish: true` is required for each item; exact canonical URL exclusions override inclusion. Queries, fragments, non-HTTPS origins and off-site item/logo URLs are rejected. Supply real modification timestamps; do not invent per-page dates. The output directory must be new. Review every file before mounting routes or copying into the host public directory.

```js
import {generateDiscovery, discoveryHeadLinks} from 'web-respect-dpro/feed';
const files = generateDiscovery(ownerApprovedConfig);
// Serve files[path].body with files[path].contentType through host routes.
// Add discoveryHeadLinks(ownerApprovedConfig.siteUrl) to the shared HTML head.
```

Outputs: `feed/index.html`, RSS `feed.xml`, Atom `atom.xml`, JSON Feed 1.1 `feed.json`, `sitemap.xml`, `llms.txt`, `llms-full.txt` and a `robots-sitemap.txt` merge snippet. Preserve and merge existing feeds, sitemap indexes and robots policies. The snippet is not a replacement robots.txt. llms-full.txt contains selected summaries, not scraped full pages. The inventory has a 50,000-item and sitemap 50 MB limit; larger sites need host pagination/sitemap indexes.

The hub follows the owner-provided centered card layout, with colored format icons and optional host logo. Adapt typography and colors to the host design system. Only the main hub contains a small `Powered by Dpro` text link to https://dpro.at/; there is no Dpro logo, tracking, external font/icon request or nofollow attribute. Machine-readable files have no attribution.

For WordPress, use this generator during a server build/export or implement equivalent dynamic routes from explicitly approved published post types and permalinks. The existing WordPress widget does not automatically publish feeds. Rebuild on content changes; remove expired jobs and withdrawn content from every format. Do not use robots.txt to protect confidential pages. Social previews still need correct Open Graph/Twitter metadata on content pages; discovery files do not guarantee rankings or AI ingestion.

Standards: [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/), [Atom](https://www.rfc-editor.org/rfc/rfc4287), [RSS](https://www.rssboard.org/rss-specification), [Sitemaps](https://www.sitemaps.org/protocol.html). [llms.txt](https://llmstxt.org/) is a proposed convention.

## Existing robots rules

Provide `robotsTxt` only after reviewing the existing site-root robots.txt with the owner. The generator preserves those rules, adds its Sitemap reference once, and adds public discovery URLs as `# Discovery:` comments. Comments do not instruct crawlers. Existing sitemap references are preserved. Without `robotsTxt`, only the merge snippet is generated; no replacement crawler policy is invented. Deploy reviewed robots.txt at the site root, never under `/feed/`. The hub links to robots.txt when generated, otherwise to the sitemap merge snippet.
