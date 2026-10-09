import {createApp,h,onMounted,onBeforeUnmount,ref} from 'vue';
import {mount,type Toolkit} from '../../dist/browser.js';
createApp({setup(){const element=ref<HTMLElement>();let toolkit:Toolkit;onMounted(()=>toolkit=mount(element.value!,{namespace:'wr-vue',showLauncher:'always',consent:{policyVersion:'1'}}));onBeforeUnmount(()=>void toolkit?.dispose());return()=>h('div',[h('h1','Vue integration'),h('button',{onClick:()=>toolkit.open('accessibility')},'Accessibility'),h('button',{onClick:()=>toolkit.open('consent')},'Consent preferences'),h('div',{ref:element})]);}}).mount('#app');
