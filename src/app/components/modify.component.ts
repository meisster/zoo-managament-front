import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: `modify`,
  template: `
      <mat-form-field color="warn">
          <mat-icon matSuffix>search</mat-icon>
          <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
      </mat-form-field>
      <table mat-table [dataSource]="data" matSort class="mat-elevation-z8">
          <ng-container *ngFor="let item of columnKeys">
              <ng-container matColumnDef="{{ item }}">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ columnValues[item] }} </th>
                  <td mat-cell *matCellDef="let element">{{element[item]}}</td>
              </ng-container>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnKeys"></tr>
          <tr mat-row *matRowDef="let row; columns: columnKeys;"></tr>
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
  // tslint:disable-next-line:variable-name
  private _data;
  @Input() columnKeys: string[];
  @Output() filter: EventEmitter<string> = new EventEmitter<string>();

  @Input('dataSource') set data(dataSource) {
    this._data = new MatTableDataSource(dataSource);
    this._data.sort = this.sort;
  }

  get data() {
    return this._data;
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  columnValues: { [key: string]: string } = {
    name: 'Name',
    species: 'Species',
    roomId: 'Room ID',
    surface: 'Surface',
    price: 'Price'
  };

  ngOnInit(): void {
    this._data.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this._data.filter = filterValue.trim().toLowerCase();
    this.filter.emit(filterValue.trim().toLowerCase());
  }

}
