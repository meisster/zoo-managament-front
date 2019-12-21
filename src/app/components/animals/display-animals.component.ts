import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DialogDetailsComponent} from './dialog-details.component';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {EditAnimalsComponent} from './edit-animals.component';

@Component({
  selector: `display-animals`,
  template: `
    <mat-form-field color="warn" appearance="outline">
      <mat-icon matSuffix>search</mat-icon>
      <mat-label>Filter</mat-label>
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter items...">
    </mat-form-field>
    <table mat-table [dataSource]="tableData" matSort multiTemplateDataRows class="mat-elevation-z8">
      <ng-container matColumnDef="{{ key }}" *ngFor="let key of tableKeys; let i = index;">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ columnLabels[i] }} </th>
        <td mat-cell *matCellDef="let element">{{element[key]}}</td>
      </ng-container>
      <ng-container matColumnDef="expandedDetail">
        <td mat-cell *matCellDef="let element" [attr.colspan]="tableKeys.length">
          <div class="element-detail"
               [@detailExpand]="element == expandedElement ? 'expanded' : 'collapsed'">
            <div class="element-description">
              <img *ngIf="element.photoUrl" src="{{ element.photoUrl }}" alt="" width="250px">
              <span class="element-description-text" style="width: 100%">{{element.description}}
                <span class="element-description-attribution"> -- Wikipedia </span>
                          </span>
              <div class="manage-buttons">
                <button mat-flat-button (click)="sellItem(element)" matTooltip="Sell this item">
                  <mat-icon>attach_money</mat-icon>
                </button>
                <button mat-flat-button (click)="modifyItem(element)" matTooltip="Modify item's state and update">
                  <mat-icon>edit</mat-icon>
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
  providers: [ConnectorService]
})
export class DisplayAnimalsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  endpoint: string = EditAnimalsComponent.ENDPOINT;
  expandedElement: any;
  private tableData;
  tableKeys: string[] = [];
  columnLabels: string[] = [];

  constructor(public dialog: MatDialog, private connector: ConnectorService, private _snackBar: MatSnackBar) {
    this.tableKeys = DatabaseData.animalsColumnKeys;
    this.columnLabels = DatabaseData.animalsColumnNames;
    this.acquireData(this.endpoint);
  }

  acquireData(endpoint: string) {
    this.connector.get(endpoint).subscribe((response) => {
        this.tableData = new MatTableDataSource(this.connector.retrieveData(endpoint, response));
        this.tableData.sort = this.sort;
      },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  ngOnInit(): void {
    // this.tableData.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  refresh() {
    this.acquireData(EditAnimalsComponent.ENDPOINT);
  }

  modifyItem(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '400px',
      data: DatabaseData.dialogData(element)[(this.endpoint)].modify
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Animal edited succesfully', 'OK', {duration: 4000});
      } else if (result === 'error') {
        this._snackBar.open('Given data are incorrect!', 'OK', {duration: 4000});
      }
    });
  }

  sellItem(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '400px',
      data: DatabaseData.dialogData(element)[(this.endpoint)].sell
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Animal sold succesfully', 'OK', {duration: 4000});
        setTimeout(() => this.refresh(), 400);
      } else if (result === 'error') {
        this._snackBar.open('Animal can\'t be sold', 'OK', {duration: 4000});
      }
    });
  }
}
