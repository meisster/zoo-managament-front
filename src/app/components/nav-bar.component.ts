import {Component} from '@angular/core';

@Component({
  selector: 'nav-bar',
  template: `
      <mat-toolbar color="primary">
          <mat-toolbar-row>
              <button mat-button routerLink="/home" routerLinkActive="active"
                      style="font-size: 18px; border-bottom: 1px solid gray;">Home</button>
              <button mat-button [matMenuTriggerFor]="menu">Manage tables</button>
              <mat-menu #menu="matMenu">
                  <button mat-menu-item routerLink="/edit/animals">Manage animals</button>
                  <button mat-menu-item routerLink="/edit/rooms">Manage rooms</button>
                  <button mat-menu-item routerLink="/edit/species">Manage species</button>
                  <button mat-menu-item routerLink="/edit/category">Manage category</button>
              </mat-menu>
              <button mat-button>{{ "Show database" }}</button>
          </mat-toolbar-row>
      </mat-toolbar>

  `,
})
export class NavigationBarComponent {
}
