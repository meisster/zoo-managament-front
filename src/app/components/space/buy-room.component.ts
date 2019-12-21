import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'buy-room',
  template: `
    <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
      <mat-form-field color="warn" appearance="outline">
        <mat-label>Localization</mat-label>
        <input type="number" name="localization" matInput formControlName="localization">
        <mat-error *ngIf="myGroup.controls.localization.invalid" style="font-size: 12px">Fill the required field!</mat-error>
      </mat-form-field>
      <mat-divider style="margin: 1rem 0"></mat-divider>
      <button mat-button mat-flat-button>Submit</button>
    </form>
  `,
  providers: [ConnectorService]
})
export class BuyRoomComponent {
  myGroup = new FormGroup({localization: new FormControl('', Validators.required)});
  @Input() dialogData;
  @Output() response: EventEmitter<string> = new EventEmitter<string>();

  constructor(private connector: ConnectorService) {
  }

  onSubmit() {
    if (this.myGroup.valid) {
      this.response.emit(this.myGroup.value.localization);
    }
  }
}
