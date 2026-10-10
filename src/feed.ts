/** Build public discovery files from an explicit owner-approved content inventory. */
export interface FeedItem {
  url: string; title: string; description: string; publish: boolean;
  category?: string; language?: string; updated?: string;
}
export interface FeedConfig {
  siteUrl: string; title: string; description: string; language: string;
  logo?: string; updated: string; items: FeedItem[];
  exclude?: string[];
  /** Existing owner-approved crawler rules; omitted when not reviewed. */
  robotsTxt?: string;
}
export interface DiscoveryFile { contentType: string; body: string }
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const markdown = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/[\\[\]()*_`<>]/g, '\\$&');
function date(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error('Use an ISO timestamp with a timezone.');
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) throw new Error('Timestamp requires a timezone.');
  return new Date(value).toISOString();
}
/** No crawling, network calls, filesystem writes or implicit publication. */
export function generateDiscovery(config: FeedConfig): Record<string, DiscoveryFile> {
  const site = new URL(config.siteUrl);
  if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash || site.pathname !== '/') throw new Error('siteUrl must be an HTTPS origin.');
  const origin = site.origin;
  const url = (value: string) => {
    const result = new URL(value, origin);
    if (result.origin !== origin || result.username || result.password || result.search || result.hash) throw new Error('Discovery URLs must be public same-origin URLs without query strings or fragments.');
    return result.href.replace(/\(/g, '%28').replace(/\)/g, '%29');
  };
  if (!/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/.test(config.language)) throw new Error('Use a language tag.');
  const updated = date(config.updated);
  const excluded = new Set((config.exclude ?? []).map(url));
  const seen = new Set<string>();
  const items = config.items.filter(item => item.publish === true).map(item => ({...item, url: url(item.url), updated: item.updated ? date(item.updated) : undefined})).filter(item => {
    if (excluded.has(item.url)) return false;
    if (seen.has(item.url)) throw new Error('Duplicate public content URL.');
    seen.add(item.url); return true;
  });
  if (items.length > 50000) throw new Error('Split inventories exceeding 50,000 URLs into separate sitemaps.');
  const e = escape;
  const logo = config.logo ? `<img src="${e(url(config.logo))}" alt="${e(config.title)}" width="160" height="48">` : '';
  const tasks:Record<string,[string,string]> = {
    '/feed.xml':['Subscribe to updates','Titles, public links, summaries and publication dates for RSS readers.'],
    '/atom.xml':['Connect feed readers','The same approved updates with stable IDs and modification timestamps.'],
    '/feed.json':['Connect apps','Structured titles, URLs, summaries and language data for compatible clients.'],
    '/sitemap.xml':['Discover public pages','Canonical public URLs and modification dates for search crawlers.'],
    '/llms.txt':['Guide AI readers','A content index with links and short descriptions.'],
    '/llms-full.txt':['Read content summaries','A readable collection of site content summaries.'],
    '/robots.txt':['Review crawler rules','Crawler access rules and the location of the sitemap.'],
    '/robots-sitemap.txt':['Merge crawler discovery','A Sitemap line to merge into the existing site-root robots.txt.'],
  };
  const cards = [
    ['RSS 2.0 Feed', '/feed.xml', '<circle cx="5" cy="19" r="1"/><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>', '#c54800'],
    ['Atom Feed', '/atom.xml', '<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>', '#006ab8'],
    ['JSON Feed', '/feed.json', '<path d="M9 3H7v6l-3 3 3 3v6h2M15 3h2v6l3 3-3 3v6h-2"/>', '#876000'],
    ['Sitemap', '/sitemap.xml', '<path d="M12 8v5M4 17v-4h16v4"/><rect x="9" y="2" width="6" height="6" rx="1"/><rect x="1" y="17" width="6" height="5" rx="1"/><rect x="17" y="17" width="6" height="5" rx="1"/>', '#177332'],
    ['LLMs.txt', '/llms.txt', '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>', '#71349b'],
    ['LLMs summaries', '/llms-full.txt', '<path d="M14 2H5v20h14V7Z M14 2v5h5M8 12h8M8 16h8"/>', '#71349b'],
    [config.robotsTxt === undefined ? 'Robots sitemap snippet' : 'Robots.txt', config.robotsTxt === undefined ? '/robots-sitemap.txt' : '/robots.txt', '<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M12 7V3M9 3h6M8 12h1M15 12h1M8 17h8"/>', '#4b6075'],
  ].map(([label, path, icon, color]) => `<a class="card" href="${path}"><span class="icon" style="color:${color}" aria-hidden="true"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></span><span><span class="task">${tasks[path][0]}</span><strong>${label}</strong><span class="description">${tasks[path][1]}</span><small>${path}</small></span><span aria-hidden="true">›</span></a>`).join('');
  const html = `<!doctype html><html lang="${e(config.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(config.title)} — Feeds</title><meta name="description" content="${e(config.description)}"><link rel="canonical" href="${origin}/feed/">${discoveryHeadLinks(origin)}<style>body{margin:0;background:#fff;color:#172033;font:16px/1.6 system-ui,sans-serif}main{max-width:640px;margin:auto;padding:48px 24px;text-align:center}img{object-fit:contain;max-width:100%;height:auto}h1{font-size:2rem}p{color:#526174}.cards{display:grid;gap:16px;margin:32px 0}.card{display:flex;align-items:center;gap:20px;text-align:left;padding:24px;border:1px solid #d7dde5;border-radius:20px;color:inherit;text-decoration:none}.card:hover{border-color:#71349b}.card:focus-visible,a:focus-visible{outline:3px solid #71349b;outline-offset:4px}.icon{font-size:28px;min-width:40px}.card span:nth-child(2){flex:1}.task{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#65308d}.description{display:block;margin:5px 0;font-size:14px;color:#526174}small{display:block;color:#526174;overflow-wrap:anywhere}footer{margin-top:32px;border-top:1px solid #d7dde5;padding-top:24px}a{color:#65308d}</style></head><body><main>${logo}<h1>${e(config.title)} Feeds</h1><p>${e(config.description)}</p><nav class="cards" aria-label="Public feeds and discovery files">${cards}</nav><a href="${origin}/">Back to ${e(config.title)}</a><footer><small>Powered by <a href="https://dpro.at/">Dpro</a></small></footer></main></body></html>`;
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${e(config.title)}</title><link>${origin}/</link><description>${e(config.description)}</description><language>${e(config.language)}</language>${items.map(i => `<item><title>${e(i.title)}</title><link>${e(i.url)}</link><guid isPermaLink="true">${e(i.url)}</guid><description>${e(i.description)}</description>${i.updated ? `<pubDate>${new Date(i.updated).toUTCString()}</pubDate>` : ''}${i.category ? `<category>${e(i.category)}</category>` : ''}</item>`).join('')}</channel></rss>`;
  const atom = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${e(config.language)}"><id>${origin}/feed/</id><title>${e(config.title)}</title><subtitle>${e(config.description)}</subtitle><updated>${updated}</updated><author><name>${e(config.title)}</name></author><link href="${origin}/atom.xml" rel="self"/><link href="${origin}/"/>${items.map(i => `<entry><id>${e(i.url)}</id><title>${e(i.title)}</title><link href="${e(i.url)}"/><updated>${i.updated ?? updated}</updated><summary>${e(i.description)}</summary></entry>`).join('')}</feed>`;
  const json = JSON.stringify({version:'https://jsonfeed.org/version/1.1', title:config.title, description:config.description, home_page_url:origin+'/', feed_url:origin+'/feed.json', language:config.language, items:items.map(i => ({id:i.url,url:i.url,title:i.title,content_text:i.description,language:i.language ?? config.language,...(i.category ? {tags:[i.category]} : {}),...(i.updated ? {date_modified:i.updated} : {})}))}, null, 2);
  const llms = `# ${markdown(config.title)}\n\n> ${markdown(config.description)}\n\n## Public content\n\n${items.map(i => `- [${markdown(i.title)}](${i.url}): ${markdown(i.description)}`).join('\n')}\n`;
  const full = `# ${markdown(config.title)}\n\n${markdown(config.description)}\n\n${items.map(i => `## ${markdown(i.title)}\n\nURL: ${i.url}\n\n${markdown(i.description)}`).join('\n\n')}\n`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.map(i => `<url><loc>${e(i.url)}</loc>${i.updated ? `<lastmod>${i.updated}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  if (new TextEncoder().encode(sitemap).length > 50 * 1024 * 1024) throw new Error('Split sitemaps exceeding 50 MB.');
  const robots = config.robotsTxt === undefined ? undefined : config.robotsTxt.replace(/\s*$/, '\n') + [`Sitemap: ${origin}/sitemap.xml`, ...['/feed/', '/feed.xml', '/atom.xml', '/feed.json', '/llms.txt', '/llms-full.txt'].map(path => `# Discovery: ${origin}${path}`)].filter(line => !config.robotsTxt!.split(/\r?\n/).some(existing => existing.trim() === line)).map(line => line + '\n').join('');
  return {'feed/index.html':{contentType:'text/html; charset=utf-8',body:html},'feed.xml':{contentType:'application/rss+xml; charset=utf-8',body:rss},'atom.xml':{contentType:'application/atom+xml; charset=utf-8',body:atom},'feed.json':{contentType:'application/feed+json; charset=utf-8',body:json},'llms.txt':{contentType:'text/plain; charset=utf-8',body:llms},'llms-full.txt':{contentType:'text/plain; charset=utf-8',body:full},'sitemap.xml':{contentType:'application/xml; charset=utf-8',body:sitemap},'robots-sitemap.txt':{contentType:'text/plain; charset=utf-8',body:`Sitemap: ${origin}/sitemap.xml\n`},...(config.robotsTxt === undefined ? {} : {'robots.txt':{contentType:'text/plain; charset=utf-8',body:robots!}})};
}
export function discoveryHeadLinks(siteUrl: string): string {
  const origin = new URL(siteUrl).origin;
  if (!origin.startsWith('https://')) throw new Error('Use HTTPS.');
  return `<link rel="alternate" type="application/rss+xml" href="${escape(origin)}/feed.xml" title="RSS"><link rel="alternate" type="application/atom+xml" href="${escape(origin)}/atom.xml" title="Atom"><link rel="alternate" type="application/feed+json" href="${escape(origin)}/feed.json" title="JSON Feed">`;
}
