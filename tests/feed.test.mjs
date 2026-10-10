import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateDiscovery} from '../dist/feed.js';
const config = {siteUrl:'https://example.org',title:'Host <Brand>',description:'Public & approved',language:'en',updated:'2026-10-10T00:00:00Z',logo:'/logo.svg',items:[{url:'/public/',title:'A < B',description:'Safe & useful',publish:true},{url:'/secret/',title:'SECRET_MARKER',description:'PRIVATE_DATA',publish:false},{url:'/excluded/',title:'EXCLUDED_MARKER',description:'EXCLUDED_DATA',publish:true}],exclude:['/excluded/']};
test('approved publication scope and attribution hold across all formats', () => {
  const files = generateDiscovery(config);
  for (const [path, file] of Object.entries(files)) {
    assert.doesNotMatch(file.body,/SECRET_MARKER|PRIVATE_DATA|EXCLUDED_MARKER|EXCLUDED_DATA|\/secret\/|\/excluded\//);
    if (path !== 'feed/index.html') assert.doesNotMatch(file.body,/Powered by|dpro\.at/);
  }
  assert.equal(JSON.parse(files['feed.json'].body).items.length,1);
  assert.match(files['feed.xml'].body,/A &lt; B/);
  assert.match(files['feed/index.html'].body,/<a href="https:\/\/dpro.at\/">Dpro<\/a>/);
  assert.doesNotMatch(files['feed/index.html'].body,/nofollow|<script|(?:src|href)="https:\/\/[^" ]*(?:cdn|fonts\.)/);
  assert.match(files['feed/index.html'].body,/https:\/\/example.org\/logo.svg/);
});
test('unsafe URLs and ambiguous dates fail before publication', () => {
  for (const url of ['https://other.example/public','javascript:alert(1)','/public/?token=secret']) assert.throws(() => generateDiscovery({...config,items:[{...config.items[0],url}]}));
  assert.throws(() => generateDiscovery({...config,updated:'2026-10-10T00:00:00'}));
  assert.throws(() => generateDiscovery({...config,items:[config.items[0],config.items[0]]}));
});

test('robots rules are preserved and the generated sitemap is added once', () => {
  const rules='User-agent: *\nDisallow: /admin/\nSitemap: https://example.org/existing.xml\n';
  const files=generateDiscovery({...config,robotsTxt:rules});
  assert.ok(files['robots.txt'].body.startsWith(rules));
  assert.match(files['robots.txt'].body,/Sitemap: https:\/\/example.org\/sitemap.xml/);
  const again=generateDiscovery({...config,robotsTxt:files['robots.txt'].body});
  assert.equal(again['robots.txt'].body,files['robots.txt'].body);
  assert.match(files['feed/index.html'].body,/href="\/robots.txt"/);
  assert.equal(generateDiscovery(config)['robots.txt'],undefined);
});
