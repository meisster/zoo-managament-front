import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConnectorService} from '../connector/connector.service';

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
      <h1 mat-dialog-title>{{data.title}}</h1>
      <div mat-dialog-content>
          <p>{{data.content}}</p>
          <modify-item *ngIf="data.animal" [modifiedItem]="data" [filterData]="filterData" (onSubmit)="onDataSubmitted($event)"></modify-item>
      </div>
      <div *ngIf="!data.animal" mat-dialog-actions>
          <button mat-button [mat-dialog-close]="data">{{data.okClick}}</button>
          <button mat-button (click)="onNoClick()" cdkFocusInitial>{{data.noClick}}</button>
      </div>
  `,
  providers: [ConnectorService]
})
export class DialogDetailsComponent {
  filterData: { [key: string]: string[] } = {};

  constructor(
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private connector: ConnectorService) {
    if (data.endpoint === 'animals') {
      connector.getRoomsBySpecies(data.animal.species).subscribe(
        rooms => this.filterData = rooms[0]);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDataSubmitted(data): void {
    console.log('Sending data to server: ', data);
    this.dialogRef.close();
  }

}
