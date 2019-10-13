import {Component, EventEmitter, Output} from '@angular/core';
import {Edit, Header} from '../models/nav-bar-model';

export interface Headers {
  type: Header;
  name: string;
}

export interface Edits {
  type: Edit;
  name: string;
}

@Component({
  selector: 'nav-bar',
  template: `
      <mat-toolbar color="primary">
          <mat-toolbar-row>
              <button mat-button routerLink="/home" routerLinkActive="active">{{ "Home" }}</button>
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
  @Output() onTabClicked: EventEmitter<number> = new EventEmitter<number>();
  currentTab: number = 0;
  headers: Headers[] = [
    {
      type: Header.Home,
      name: 'Home'
    },
    {
      type: Header.Edit,
      name: 'Edit database'
    },
    {
      type: Header.Show,
      name: 'Show database'
    }
  ];
  edits: Edits[] = [
    {
      type: Edit.A,
      name: 'A'
    },
    {
      type: Edit.B,
      name: 'B'
    },
    {
      type: Edit.C,
      name: 'C'
    },
    {
      type: Edit.D,
      name: 'D'
    }
  ];

  tabClick(tabIndex: number): void {
    this.currentTab = tabIndex;
    this.onTabClicked.emit(tabIndex);
  }
}
