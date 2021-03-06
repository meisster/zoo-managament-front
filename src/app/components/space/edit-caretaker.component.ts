import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'edit-caretaker-dialog',
  template: `
    <h1 mat-dialog-title>{{dialogData.title}}</h1>

    <div mat-dialog-content>
      <p>{{dialogData.content}}</p>
      <form class="input-container" #f="ngForm" (ngSubmit)="onSubmit(f)">
        <mat-form-field color="warn" appearance="outline">
          <mat-label>Caretaker ID</mat-label>
          <input id="caretakerId" ngModel type="number" name="caretakerId" matInput required value="dialogData.caretakerId">
          <mat-error style="font-size: 12px">Fill the required field!</mat-error>
        </mat-form-field>
        <button mat-button>Submit</button>
      </form>
    </div>
    <div mat-dialog-actions>
    </div>

  `
})
export class EditCaretakerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCaretakerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
  }

  onSubmit(form) {
    console.log(form);
    if (form.valid) {
      this.dialogRef.close(form.value.caretakerId);
    }
  }


}
