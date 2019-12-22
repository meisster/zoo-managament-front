import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'space-dialog',
  template: `
    <h1 mat-dialog-title>{{dialogData.title}}</h1>
    <div mat-dialog-content>
      <p>{{dialogData.content}}</p>
      <buy-room *ngIf="this.dialogData.title === 'Buy room'" [dialogData]="dialogData" (response)="onSubmit($event)"></buy-room>
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
    this.dialogRef.close();
  }

  editCaretaker() {

  }

  buyRoom(data) {
    this.connector.patch('rooms/' + this.dialogData.room.id + '/buy', data).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message || error.message
        });
      });
  }

  private buyEnclosure() {
    this.connector.patch('enclosures/' + this.dialogData.enclosure.id + '/buy', {}).subscribe(
      response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message || error.message
        });
      });
  }

  private sellEnclosure() {
    this.connector.patch('enclosures/' + this.dialogData.enclosure.id + '/destroy', {}).subscribe(
      response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message || error.message
        });
      });
  }


  deleteRoom() {
    this.connector.deleteRooms(this.dialogData.room).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close('error');
      });
  }

  private fireCaretaker() {
    this.connector.fireCaretaker(this.dialogData.caretaker.id).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message || error.message
        });
      });
  }

  private fireEntertainer() {
    this.connector.fireEntertainer(this.dialogData.entertainer.id).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message || error.message
        });
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
      case 'Delete room':
        this.deleteRoom();
        break;
      case 'Buy enclosure':
        this.buyEnclosure();
        break;
      case 'Sell enclosure':
        this.sellEnclosure();
        break;
      case 'Fire caretaker':
        this.fireCaretaker();
        break;
      case 'Fire entertainer':
        this.fireEntertainer();
        break;
    }
  }
}
