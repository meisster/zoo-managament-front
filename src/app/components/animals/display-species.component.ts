import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {DialogDetailsComponent} from './dialog-details.component';

@Component({
  selector: `display-species`,
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
                              <button mat-flat-button (click)="buy(element)" matTooltip="Buy an animal of this species">
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
  providers: [ConnectorService]
})
export class DisplaySpeciesComponent {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:variable-name
  private _tableData;
  private tableKeys: string[] = [];
  private columnLabels: string[] = [];

  get tableData() {
    return this._tableData;
  }

  expandedElement: any;

  constructor(public dialog: MatDialog, private connector: ConnectorService, private _snackBar: MatSnackBar) {
    this.tableKeys = DatabaseData.speciesColumnKeys;
    this.columnLabels = DatabaseData.speciesColumnNames;
    this.connector.get('species').subscribe(response => {
      this._tableData = new MatTableDataSource(connector.retrieveData('species', response));
      this._tableData.sort = this.sort;
    },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  applyFilter(filterValue: string) {
    this._tableData.filter = filterValue.trim().toLowerCase();
  }

  buy(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '400px',
      data: {
        title: 'Buy animal',
        animal: element,
        endpoint: 'animals',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'success') {
        this._snackBar.open('Animal bought succesfully', 'OK', {duration: 4000});
      } else if (result.status === 'error') {
        this._snackBar.open('Can\'t buy animal of this species: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }
}
