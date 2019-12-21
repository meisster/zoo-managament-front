import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'add-caretaker-dialog',
  template: `
    <h1 mat-dialog-title>{{dialogData.title}}</h1>

    <div mat-dialog-content>
      <p>{{dialogData.content}}</p>
      <form class="input-container" #f="ngForm" (ngSubmit)="onSubmit(f)">
        <mat-form-field color="warn" appearance="outline">
          <mat-label>Caretaker Name</mat-label>
          <input id="firstName" ngModel type="text" name="firstName" matInput required>
          <mat-error style="font-size: 12px">Fill the required field!</mat-error>
        </mat-form-field>
        <mat-form-field color="warn" appearance="outline">
          <mat-label>Caretaker Last Name</mat-label>
          <input id="name" ngModel type="text" name="name" matInput required>
          <mat-error style="font-size: 12px">Fill the required field!</mat-error>
        </mat-form-field>
        <mat-form-field color="warn" appearance="outline">
          <mat-label>Contract Type</mat-label>
          <mat-select ngModel name="type" required id="contractType">
            <mat-option value="JUNIOR">Junior</mat-option>
            <mat-option value="REGULAR">Regular</mat-option>
            <mat-option value="SENIOR">Senior</mat-option>
            <mat-option value="LEAD">Lead</mat-option>
          </mat-select>
          <mat-error style="font-size: 12px">Fill the required field!</mat-error>
        </mat-form-field>
        <button mat-button>Submit</button>
      </form>
    </div>
    <div mat-dialog-actions>
    </div>

  `
})
export class CaretakersDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CaretakersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
  }

  onSubmit(form) {
    if (form.valid) {
      this.dialogRef.close(form.value);
    }
  }


}
