<?php
/**
 * Plugin Name: Web Respect
 * Description: Host-configurable accessibility and consent controls with footer links.
 * Version: 0.4.0
 * License: MIT
 * Requires PHP: 8.0
 */
if (!defined('ABSPATH')) exit;
add_action('wp_enqueue_scripts',function(){
 wp_enqueue_script('web-respect',plugins_url('web-respect.js',__FILE__),[], '0.4.0',true);
 wp_enqueue_script('web-respect-host',plugins_url('host.js',__FILE__),['web-respect'],'0.4.0',true);
 $logo=get_theme_mod('custom_logo');$image=$logo?wp_get_attachment_image_url($logo,'full'):get_site_icon_url(32);
 $configuration=apply_filters('web_respect_config',[
  'namespace'=>'web-respect-wp-'.get_current_blog_id(),
  'locale'=>str_replace('_','-',get_locale()),
  'brand'=>['name'=>get_bloginfo('name'),'url'=>home_url('/'),'logo'=>$image?:null],
  'policies'=>['privacy'=>get_privacy_policy_url()],
  'consent'=>['policyVersion'=>'1'],
  'showLauncher'=>'always',
 ]);
 // The configuration may contain URLs/labels only; SDK callbacks live in host JS.
 wp_add_inline_script('web-respect-host','window.webRespectConfig='.wp_json_encode($configuration,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).';','before');
});
add_action('wp_footer',function(){echo '<div id="web-respect-mount"></div><span id="web-respect-footer"></span>';});
add_shortcode('web_respect_footer',function(){return '<span data-web-respect-footer></span>';});
