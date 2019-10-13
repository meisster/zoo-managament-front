import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
      <h1 mat-dialog-title>{{data.title}}</h1>
      <div mat-dialog-content>
          <p>{{data.content}}</p>
      </div>
      <div mat-dialog-actions>
          <button mat-button (click)="onNoClick()">{{data.noClick}}</button>
          <button mat-button [mat-dialog-close]="data" cdkFocusInitial>{{data.okClick}}</button>
      </div>
  `
})
export class DialogDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
