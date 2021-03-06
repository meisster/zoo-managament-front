import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {SpaceDialogComponent} from './space-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EditCaretakerDialogComponent} from './edit-caretaker.component';
import {EditEnclosureDialogComponent} from './edit-enclosure.component';

@Component({
  selector: 'my-rooms',
  template: `
    <mat-form-field color="warn" appearance="outline">
      <mat-icon matSuffix>search</mat-icon>
      <mat-label>Filter</mat-label>
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter items...">
    </mat-form-field>
    <table mat-table [dataSource]="roomsData" matSort multiTemplateDataRows class="mat-elevation-z8">
      <ng-container matColumnDef="{{ key }}" *ngFor="let key of tableKeys; let i = index;">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ columnLabels[i] }} </th>
        <td mat-cell *matCellDef="let element">{{element[key]}}</td>
      </ng-container>
      <ng-container matColumnDef="expandedDetail">
        <td mat-cell *matCellDef="let element" [attr.colspan]="tableKeys.length">
          <div class="element-detail"
               [@detailExpand]="element == expandedElement ? 'expanded' : 'collapsed'">
            <div class="element-description">
                                  <span class="element-description-text" style="width: 100%; font-size: 18px;">
                                      Can host species: <span class="element-description-attribution"
                                                              *ngFor="let species of element.species">{{ species }}</span><br>
                                      <div class="element-description-row">
                                          <p>Caretaker ID: </p><span
                                        class="element-description-attribution"> {{ element.caretakerId }}</span>
                                          <button *ngIf="!element.caretakerId" mat-flat-button (click)="editCaretaker(element)" matTooltip="Edit caretaker">
                                              <mat-icon>edit</mat-icon>
                                          </button>
                                      </div>
                                        <div class="element-description-row">
                                            <p>Enclosure ID: </p><span
                                          class="element-description-attribution"> {{ element.enclosureId }}</span>
                                        <button mat-flat-button (click)="editEnclosure(element)" matTooltip="Edit enclosure">
                                            <mat-icon>edit</mat-icon>
                                        </button>
                                        </div>
                                  </span>
              <div class="manage-buttons">
                <button mat-flat-button (click)="deleteRoom(element.id)" matTooltip="Delete room">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="tableKeys"></tr>
      <tr mat-row *matRowDef="let element; columns: tableKeys;"
          class="element-row"
          [class.expanded-row]="expandedElement === element"
          (click)="expandedElement = expandedElement === element ? null : element">
      </tr>
      <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row"></tr>
    </table>
  `,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyRoomsComponent {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private roomsData;
  private tableKeys: string[] = [];
  private columnLabels: string[] = [];

  expandedElement: any;

  constructor(public dialog: MatDialog, private connector: ConnectorService, private _snackBar: MatSnackBar) {
    this.tableKeys = DatabaseData.roomsColumnKeys;
    this.columnLabels = DatabaseData.roomsColumnNames;
    this.acquireData();
  }

  private acquireData() {
    this.connector.get('rooms').subscribe(response => {
        const parsedRoomsData = this.connector.retrieveData('rooms', response);
        this.roomsData = new MatTableDataSource(parsedRoomsData.filter(room => room.bought));
        this.roomsData.sort = this.sort;
      },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  applyFilter(filterValue: string) {
    this.roomsData.filter = filterValue.trim().toLowerCase();
  }

  refresh() {
    this.acquireData();
  }

  deleteRoom(id) {
    const dialogRef = this.dialog.open(SpaceDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete room',
        room: id,
        endpoint: 'rooms',
        content: 'Are you sure you want to delete room ' + id + ' for 0$ ?',
        okClick: 'Yes',
        noClick: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Room deleted succesfully', 'OK', {duration: 4000});
        setTimeout(() => this.refresh(), 400);
      } else if ((result || '') === 'error') {
        this._snackBar.open('Room can\'t be deleted', 'OK', {duration: 4000});
      }
    });
  }

  editCaretaker(room: any) {
    console.log(room)
    const dialogRef = this.dialog.open(EditCaretakerDialogComponent, {
      width: '400px',
      data: {
        title: 'Edit caretaker',
        caretaker: room.caretakerId,
        endpoint: 'rooms',
        content: 'Enter Caretaker ID',
        okClick: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe((caretakerId: number) => {
      if (caretakerId) {
        this.updateCaretaker(room.id, caretakerId);
      }
    });
  }

  editEnclosure(room) {
    const dialogRef = this.dialog.open(EditEnclosureDialogComponent, {
      width: '400px',
      data: {
        title: 'Edit enclosure',
        caretaker: room.caretakerId,
        endpoint: 'rooms',
        content: 'Enter enclosure ID',
        okClick: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe((enclosureId: number) => {
      if (enclosureId) {
        this.updateEnclosure(room.id, enclosureId);
      }
    });
  }

  private updateCaretaker(roomId: number, caretakerId: number) {
    this.connector.updateCaretaker(roomId, caretakerId).subscribe(success => {
        this._snackBar.open('Caretaker ID updated successfully', 'OK', {duration: 4000});
        setTimeout(() => this.refresh(), 400);
      },
      error => {
        this._snackBar.open('Can\'t update caretaker ID: ' + error.error.message, 'OK', {duration: 4000});
      });
  }

  private updateEnclosure(roomId: number, enclosureId: number) {
    this.connector.updateEnclosure(roomId, enclosureId).subscribe(success => {
        this._snackBar.open('Enclosure ID updated successfully', 'OK', {duration: 4000});
        setTimeout(() => this.refresh(), 400);
      },
      error => {
        this._snackBar.open('Can\'t update enclosure ID: ' + error.error.message, 'OK', {duration: 4000});
      });
  }
}
