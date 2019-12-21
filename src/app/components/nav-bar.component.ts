import {Component} from '@angular/core';

@Component({
  selector: 'nav-bar',
  template: `
    <mat-toolbar color="primary">
      <mat-toolbar-row>
        <button mat-button routerLink="/home" routerLinkActive="active">
          <mat-icon>home</mat-icon>
        </button>
        <button mat-button routerLink="/edit/animals">Animals</button>
        <button mat-button routerLink="/edit/space">Space</button>
        <button mat-button routerLink="/edit/workers">Workers</button>
        <button mat-button routerLink="/edit/budget">Budget</button>
      </mat-toolbar-row>
    </mat-toolbar>

  `,
})
export class NavigationBarComponent {
}
