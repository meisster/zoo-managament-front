import {ApplicationRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DialogDetailsComponent} from './dialog-details.component';
import {ConnectorService} from '../connector/connector.service';
import {DatabaseData} from '../connector/database-data';

@Component({
  selector: `modify`,
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
                      <div class="manage-buttons">
                          <button mat-raised-button (click)="sellItem(element)" matTooltip="Delete item from database">
                              <mat-icon>attach_money</mat-icon>
                          </button>
                          <button mat-raised-button (click)="modifyItem(element)" matTooltip="Modify item's state and update">
                              <mat-icon>edit</mat-icon>
                          </button>
                      </div>
                      <div class="element-description">
                          <img *ngIf="element.photoUrl" src="{{ element.photoUrl }}" alt="" width="250px">
                          <span class="element-description-text" style="width: 100%">{{element.description}}
                              <span class="element-description-attribution"> -- Wikipedia </span>
                          </span>
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
export class ModifyComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // tslint:disable-next-line:variable-name
  private _tableData;
  @Input() tableKeys: string[];

  @Input('dataSource') set tableData(dataSource) {
    console.log('data source', dataSource);
    this._tableData = new MatTableDataSource(dataSource);
    this._tableData.sort = this.sort;
  }

  get tableData() {
    return this._tableData;
  }

  @Input() endpoint: string;

  expandedElement: any;

  @Input()
  columnLabels: string[] = [];

  @Output() refresh: EventEmitter<unknown> = new EventEmitter<unknown>();

  constructor(public dialog: MatDialog, private connector: ConnectorService, private appTick: ApplicationRef) {
  }

  ngOnInit(): void {
    this._tableData.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this._tableData.filter = filterValue.trim().toLowerCase();
  }

  modifyItem(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '250px',
      data: DatabaseData.dialogData(element)[(this.endpoint)].modify
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  sellItem(element) {
    const dialogRef = this.dialog.open(DialogDetailsComponent, {
      width: '400px',
      data: DatabaseData.dialogData(element)[(this.endpoint)].sell
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.connector.sellAnimal(element.id);
        setTimeout(() => this.refresh.emit(), 400);
      }
    });
  }
}
