import {Component} from '@angular/core';

@Component({
  selector: 'spinner',
  template: `
      <div class="spinner-mask">
          <mat-progress-spinner color="accent" mode="indeterminate"></mat-progress-spinner>
      </div>
  `,
})
export class SpinnerComponent {

}
