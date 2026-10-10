# WordPress plugin

Build the package, copy `dist/web-respect.js` into `web-respect/`, zip that folder and install through Plugins → Add New → Upload Plugin. The release ZIP includes the built asset. No CDN or external account is required.

The plugin uses the WordPress site language and privacy-policy URL. It never displays the site name, custom logo or site icon as widget attribution. A text-only Powered by Dpro link appears below Withdraw optional consent only while About Cookies is selected, with no attribution in the banner or accessibility drawer. Set cookie/accessibility links, policy version, real service inventory, colors and optional MCP/Feed via the `web_respect_config` filter. It does not inspect private credentials or invent service links. Add `[web_respect_footer]` in a shortcode-enabled footer area to place controls there; otherwise controls appear at `wp_footer`. This requires a theme that calls `wp_footer()`.

```php
add_filter('web_respect_config',function($config){
 $config['policies']['cookies']=home_url('/cookie-policy/');
 $config['policies']['accessibility']=home_url('/accessibility/');
 $config['theme']=['primary'=>'#003f4d','accent'=>'#006980'];
 $config['consent']['policyVersion']='2026-10';
 $config['mcp']=home_url('/mcp/'); // Only when this public service exists.
 $config['feed']=get_feed_link();
 return $config;
});
```

For trackers, enqueue your own script before `web-respect-host` and attach `web-respect:configure`; set `event.detail.consent.services` to real start/stop callbacks. Remove existing unconditional initialization from plugins/theme after inspecting their behavior. Loading this plugin cannot gate arbitrary third-party plugins, server analytics or scripts that already ran. Backend logging remains optional; if adding a REST gateway use authenticated/signed session handling, WordPress nonce/CSRF, origin and rate limits and a server-held adapter token. Never put adapter secrets into this filter.

Runtime support claims and exact tested WordPress/PHP versions are recorded in `docs/verification.md`.
