import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'space-dialog',
  template: `
      <h1 mat-dialog-title>{{dialogData.title}}</h1>
      <div mat-dialog-content>
          <p>{{dialogData.content}}</p>
          <buy-room [dialogData]="dialogData" (response)="onSubmit($event)"></buy-room>
      </div>
      <div mat-dialog-actions>
          <button mat-button [mat-dialog-close]="dialogData" (click)="onSubmit(dialogData)">{{dialogData.okClick}}</button>
          <button mat-button (click)="onNoClick()" cdkFocusInitial>{{dialogData.noClick}}</button>
      </div>
  `
})
export class SpaceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    private connector: ConnectorService) {
  }

  onNoClick() {

  }

  editCaretaker() {

  }

  buyRoom(data) {
    this.connector.patch('rooms/' + this.dialogData.room.id + '/buy', data).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close('error');
      });
  }

  onSubmit(data) {
    switch (this.dialogData.title) {
      case 'Edit caretaker':
        this.editCaretaker();
        break;
      case 'Buy room':
        this.buyRoom(data);
        break;
    }
  }
}
