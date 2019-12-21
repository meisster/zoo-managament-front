import {Component, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'spinner',
  template: `
    <div class="spinner-mask" [@showHide]="showSpinner ? 'show' : 'hide'">
      <mat-progress-spinner color="accent" mode="indeterminate"></mat-progress-spinner>
    </div>
  `,
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1,
        display: 'block'
      })),
      state('hide', style({
        opacity: 0,
        display: 'none'
      })),
      transition('show <=> hide', [
        animate('0.2s ease-in')
      ])
    ])
  ]
})
export class SpinnerComponent {

  @Input() showSpinner: boolean;

}
