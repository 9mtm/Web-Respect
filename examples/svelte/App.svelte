<script>
  import {onMount} from 'svelte';
  import {mount} from '../../dist/browser.js';
  let element; let toolkit;
  onMount(()=>{toolkit=mount(element,{namespace:'wr-svelte',showLauncher:'always',consent:{policyVersion:'1'}});return()=>{void toolkit.dispose();};});
</script>
<h1>Svelte integration</h1>
<button onclick={()=>toolkit.open('accessibility')}>Accessibility</button>
<button onclick={()=>toolkit.open('consent')}>Consent preferences</button>
<div bind:this={element}></div>
