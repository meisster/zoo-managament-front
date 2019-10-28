import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DialogDetailsComponent} from './dialog-details.component';

@Component({
  selector: `modify`,
  template: `
      <mat-form-field color="warn" appearance="outline">
          <mat-icon matSuffix>search</mat-icon>
          <mat-label>Filter</mat-label>
          <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter items...">
      </mat-form-field>
      <table mat-table [dataSource]="data" matSort multiTemplateDataRows class="mat-elevation-z8">
          <ng-container matColumnDef="{{ column }}" *ngFor="let column of columns">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ columnValues[column] }} </th>
              <td mat-cell *matCellDef="let element">{{element[column]}}</td>
          </ng-container>
          <ng-container matColumnDef="expandedDetail">
              <td mat-cell *matCellDef="let element" [attr.colspan]="columns.length">
                  <div class="element-detail"
                       [@detailExpand]="element == expandedElement ? 'expanded' : 'collapsed'">
                      <div class="element-description">
                          {{element.description}}
                          <span class="element-description-attribution"> -- Wikipedia </span>
                          <div class="manage-buttons" style="padding-top: 1rem">
                              <button mat-raised-button
                                      (click)="deleteItem(element)"
                                      matTooltip="Delete item from database">Delete</button>
                              <button mat-raised-button
                                      (click)="modifyItem(element)"
                                      matTooltip="Modify item's state and update">Modify</button>
                              <button mat-raised-button
                                      (click)="showDetails(element)"
                                      matTooltip="Show details of given item">Details</button>
                          </div>
                      </div>
                  </div>
              </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let element; columns: columns;"
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
export class ModifyComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:variable-name
  private _data;
  @Input() columns: string[];

  @Input('dataSource') set data(dataSource) {
    this._data = new MatTableDataSource(dataSource);
    this._data.sort = this.sort;
  }

  get data() {
    return this._data;
  }

  expandedElement: any;

  columnValues: { [key: string]: string } = {
    id: 'ID',
    name: 'Name',
    species: 'Species',
    roomId: 'Room ID',
    price: 'Price'
  };

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this._data.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this._data.filter = filterValue.trim().toLowerCase();
  }

  modifyItem(element) {
    console.log(element);
  }

  showDetails(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '250px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  deleteItem(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '250px',
      data: {
        title: 'Delete item',
        content: 'Are you sure you want to delete item ' + element.name + ' ?',
        okClick: 'Yes',
        noClick: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
