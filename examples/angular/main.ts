import 'zone.js';
import '@angular/compiler';
import {Component,ElementRef,ViewChild,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {register,type BrowserConfig} from '../../dist/browser.js';
register();
class App {
  @ViewChild('widget',{static:true}) widget!:ElementRef;
  ngOnInit(){this.widget.nativeElement.config={namespace:'wr-angular',showLauncher:'always',consent:{policyVersion:'1'}} satisfies BrowserConfig;}
  open(feature:'accessibility'|'consent'){this.widget.nativeElement.open(feature);}
}
Component({selector:'wr-app',standalone:true,schemas:[CUSTOM_ELEMENTS_SCHEMA],template:'<h1>Angular integration</h1><button (click)="open(\'accessibility\')">Accessibility</button><button (click)="open(\'consent\')">Consent preferences</button><web-respect #widget></web-respect>'})(App);
bootstrapApplication(App);
