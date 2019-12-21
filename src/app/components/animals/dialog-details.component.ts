import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>{{dialogData.title}}</h1>
    <div mat-dialog-content>
      <p>{{dialogData.content}}</p>
      <modify-item *ngIf="dialogData.animal"
                   [modifiedItem]="dialogData"
                   [filterKeys]="['roomId']"
                   (onSubmit)="onSubmit($event)"></modify-item>
    </div>
    <div *ngIf="!dialogData.animal" mat-dialog-actions>
      <button mat-button [mat-dialog-close]="'success'" (click)="onSubmit(null)">{{dialogData.okClick}}</button>
      <button mat-button (click)="onNoClick()" cdkFocusInitial>{{dialogData.noClick}}</button>
    </div>
  `,
  providers: [ConnectorService]
})
export class DialogDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    private connector: ConnectorService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(json): void {
    switch (this.dialogData.title) {
      case 'Buy animal':
        this.buyAnimal(json);
        break;
      case 'Modify animal':
        this.modifyAnimal(json);
        break;
      case 'Sell animal':
        this.sellAnimal();
        break;
    }
  }

  buyAnimal(json) {
    this.connector.post(this.dialogData.endpoint, {
      name: json.values.name,
      room: json.values.roomId,
      species: this.dialogData.animal.name
    }).subscribe(next => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close({
          status: 'error',
          message: error.error.message
        });
      });
  }

  modifyAnimal(json) {
    this.connector.patch(this.dialogData.endpoint + '/' + json.id, {
      name: json.values.name,
      room: json.values.roomId
    }).subscribe(response => {
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close('error');
      });
  }

  sellAnimal() {
    this.connector.sellAnimal(this.dialogData.id).subscribe(response => {
        console.log('Sell animal response: ', response);
        this.dialogRef.close('success');
      },
      error => {
        this.dialogRef.close('error');
      });
  }

}
