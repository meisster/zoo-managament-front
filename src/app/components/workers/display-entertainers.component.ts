import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SpaceDialogComponent} from '../space/space-dialog.component';
import {EntertainersDialogComponent} from './entertainers-dialog.component';

@Component({
  selector: 'display-entertainers',
  template: `
    <mat-form-field color="warn" appearance="outline">
      <mat-icon matSuffix>search</mat-icon>
      <mat-label>Filter</mat-label>
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter items...">
    </mat-form-field>
    <div style="display: flex">
      <button mat-button style="margin: auto auto 16px;" (click)="addEntertainerDialog()">
        <mat-icon>add_circle_outline</mat-icon>
      </button>
    </div>
    <table mat-table [dataSource]="entertainersData" matSort multiTemplateDataRows class="mat-elevation-z8">
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
                                      Contract payment: <span class="element-description-attribution">
                                    {{ element.contract.payment + '$'}}
                                  </span><br>
                                  </span>
              <span class="element-description-text" style="width: 100%; font-size: 18px;">
                                      Contract signing date: <span
                class="element-description-attribution">{{ element.contract.signingDate | date}}</span><br>
                                  </span>
              <div class="manage-buttons">
                <button mat-flat-button (click)="fireEntertainer(element)" matTooltip="Fire caretaker">
                  <mat-icon>remove_circle_outline</mat-icon>
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
export class DisplayEntertainersComponent {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private entertainersData;
  private tableKeys: string[] = [];
  private columnLabels: string[] = [];
  expandedElement: any;

  constructor(public dialog: MatDialog, private connector: ConnectorService, private _snackBar: MatSnackBar) {
    this.tableKeys = DatabaseData.entertainersColumnKeys;
    this.columnLabels = DatabaseData.entertainersColumnNames;
    this.acquireData();
  }

  private acquireData(): void {
    this.connector.get('entertainers').subscribe(response => {
        const parsedEnclosures = this.connector.retrieveData('entertainers', response);
        this.entertainersData = new MatTableDataSource(parsedEnclosures);
        this.entertainersData.sort = this.sort;
      },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  applyFilter(filterValue: string) {
    this.entertainersData.filter = filterValue.trim().toLowerCase();
  }

  addEntertainerDialog() {
    const dialogRef = this.dialog.open(EntertainersDialogComponent, {
      width: '400px',
      data: {
        title: 'Hire an entertainer',
        content: 'Please fill in  required information',
        endpoint: 'entertainer'
      }
    });
    dialogRef.afterClosed().subscribe(caretakerData => {
      if (caretakerData) {
        this.addEntertainer(caretakerData);
      }
    });
  }

  addEntertainer(entertainerData: { [key: string]: string }) {
    this.connector.createEntertainer(entertainerData).subscribe(
      success => {
        this._snackBar.open('Caretaker hired successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      }, error => {
        this._snackBar.open('Can\'t hire this caretaker: ' + error.error.message, 'OK', {duration: 4000});
      }
    );
  }

  fireEntertainer(element: any) {
    const dialogRef = this.dialog.open(SpaceDialogComponent, {
      width: '400px',
      data: {
        title: 'Fire entertainer',
        content: 'Are you sure you want to fire this entertainer?',
        entertainer: element,
        endpoint: 'entertainers',
        okClick: 'Yes',
        noClick: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Entertainer fired successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      } else if (result.status === 'error') {
        this._snackBar.open('Can\'t fire this entertainer: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }
}
