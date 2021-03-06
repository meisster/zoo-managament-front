import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {SpaceDialogComponent} from './space-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'rooms-to-buy',
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
                                  </span>
              <div class="manage-buttons">
                <button mat-flat-button (click)="buyRoom(element)" matTooltip="Buy room">
                  <mat-icon>add_shopping_cart</mat-icon>
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
export class RoomsToBuyComponent {
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

  private acquireData(): void {
    this.connector.get('rooms').subscribe(response => {
        const parsedRoomsData = this.connector.retrieveData('rooms', response);
        this.roomsData = new MatTableDataSource(parsedRoomsData.filter(room => !room.bought));
        this.roomsData.sort = this.sort;
      },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  applyFilter(filterValue: string) {
    this.roomsData.filter = filterValue.trim().toLowerCase();
  }

  buyRoom(element) {
    const dialogRef = this.dialog.open(SpaceDialogComponent, {
      width: '400px',
      data: {
        title: 'Buy room',
        room: element,
        endpoint: 'rooms',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Room bought succesfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      } else if ((result.status || '') === 'error') {
        this._snackBar.open('Can\'t buy this room: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }

}
