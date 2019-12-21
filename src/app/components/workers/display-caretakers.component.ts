import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CaretakersDialogComponent} from './caretakers-dialog.component';
import {SpaceDialogComponent} from '../space/space-dialog.component';

@Component({
  selector: 'display-caretakers',
  template: `
    <mat-form-field color="warn" appearance="outline">
      <mat-icon matSuffix>search</mat-icon>
      <mat-label>Filter</mat-label>
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter items...">
    </mat-form-field>
    <div style="display: flex">
      <button mat-button style="margin: auto auto 16px;" (click)="addCaretakerDialog()">
        <mat-icon>add_circle_outline</mat-icon>
      </button>
    </div>
    <table mat-table [dataSource]="caretakersData" matSort multiTemplateDataRows class="mat-elevation-z8">
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
                <button mat-flat-button (click)="fireCaretaker(element)" matTooltip="Fire caretaker">
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
export class DisplayCaretakersComponent {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private caretakersData;
  private tableKeys: string[] = [];
  private columnLabels: string[] = [];
  expandedElement: any;

  constructor(public dialog: MatDialog, private connector: ConnectorService, private _snackBar: MatSnackBar) {
    this.tableKeys = DatabaseData.caretakersColumnKeys;
    this.columnLabels = DatabaseData.caretakersColumnNames;
    this.acquireData();
  }

  private acquireData(): void {
    this.connector.get('caretakers').subscribe(response => {
        console.log(response);
        const parsedEnclosures = this.connector.retrieveData('caretakers', response);
        this.caretakersData = new MatTableDataSource(parsedEnclosures);
        this.caretakersData.sort = this.sort;
      },
      error => {
        this._snackBar.open('Server unreachable!', 'OK', {duration: 4000});
      });
  }

  applyFilter(filterValue: string) {
    this.caretakersData.filter = filterValue.trim().toLowerCase();
  }

  buyEnclosure(element) {
    const dialogRef = this.dialog.open(CaretakersDialogComponent, {
      width: '400px',
      data: {
        title: 'Buy enclosure',
        content: 'Are you sure you want to buy this enclosure for ' + element.price + '?',
        enclosure: element,
        endpoint: 'enclosures',
        okClick: 'Yes',
        noClick: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Enclosure bought successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      } else if (result.status === 'error') {
        this._snackBar.open('Can\'t buy this enclosure: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }

  sellEnclosure(element: any) {
    const dialogRef = this.dialog.open(CaretakersDialogComponent, {
      width: '400px',
      data: {
        title: 'Sell enclosure',
        content: 'Are you sure you want to sell this enclosure for ' + element.price + '?',
        enclosure: element,
        endpoint: 'enclosures',
        okClick: 'Yes',
        noClick: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Enclosure sold successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      } else if (result.status === 'error') {
        this._snackBar.open('Can\'t sell this enclosure: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }

  addCaretakerDialog() {
    const dialogRef = this.dialog.open(CaretakersDialogComponent, {
      width: '400px',
      data: {
        title: 'Hire a caretaker',
        content: 'Please fill in  required information',
        endpoint: 'enclosures'
      }
    });
    dialogRef.afterClosed().subscribe(caretakerData => {
      this.addCaretaker(caretakerData);
    });
  }

  addCaretaker(caretakerData: { [key: string]: string }) {
    this.connector.createCaretaker(caretakerData).subscribe(
      success => {
        this._snackBar.open('Caretaker hired successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      }, error => {
        this._snackBar.open('Can\'t hire this caretaker: ' + error.error.message, 'OK', {duration: 4000});
      }
    );
  }

  fireCaretaker(element: any) {
    const dialogRef = this.dialog.open(SpaceDialogComponent, {
      width: '400px',
      data: {
        title: 'Fire caretaker',
        content: 'Are you sure you want to fire this caretaker?',
        caretaker: element,
        endpoint: 'caretakers',
        okClick: 'Yes',
        noClick: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this._snackBar.open('Caretaker fired successfully', 'OK', {duration: 4000});
        setTimeout(() => this.acquireData(), 400);
      } else if (result.status === 'error') {
        this._snackBar.open('Can\'t fire this caretaker: ' + result.message, 'OK', {duration: 4000});
      }
    });
  }
}
