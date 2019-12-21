import {Component} from '@angular/core';

@Component({
  selector: 'display-space',
  template: `
    <p-accordion>
      <p-accordionTab header="My rooms" [selected]="true">
        <my-rooms></my-rooms>
      </p-accordionTab>
      <p-accordionTab header="Rooms to buy">
        <rooms-to-buy></rooms-to-buy>
      </p-accordionTab>
    </p-accordion>
  `
})
export class DisplaySpaceComponent {
  constructor() {
  }
}
