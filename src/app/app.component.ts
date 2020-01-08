import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
    <nav-bar></nav-bar>
    <router-outlet #outlet="outlet"></router-outlet>
  `,
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
