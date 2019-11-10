import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConnectorService} from '../connector/connector.service';
import {DatabaseData} from '../connector/database-data';

@Component({
  selector: `edit-database`,
  template: `
      <div class="content-wrapper">
          <mat-grid-list cols="1" rowHeight="40px">
              <mat-grid-tile style="font-size: 20px">{{ ('Displaying ' + currentTable).toLocaleUpperCase() }}</mat-grid-tile>
              <spinner *ngIf="this.showSpinner"></spinner>
          </mat-grid-list>
          <mat-divider style="margin: 10px 0;"></mat-divider>
          <mat-tab-group>
              <mat-tab label="{{ cardName(0) }}">
                  <modify
                          [tableKeys]="displayTableKeys"
                          [dataSource]="tableData"
                          [columnLabels]="columnLabels"
                          [endpoint]="currentTable"
                          (refresh)="onRefresh()"></modify>
              </mat-tab>
              <mat-tab label="{{ cardName(1) }}">
                  <add-to-table [columnLabels]="columnLabels"
                                [tableKeys]="tableKeys"
                                [tableData]="tableData"></add-to-table>
              </mat-tab>
          </mat-tab-group>
      </div>
  `,
  // tslint:disable-next-line:object-literal-sort-keys
  providers: [ConnectorService],
  changeDetection: ChangeDetectionStrategy.OnPush // this line

})
export class EditDatabaseComponent {
  showSpinner: boolean = false;
  tableEndpoint$;
  currentTable: string = '';
  tableKeys: string[] = [];
  tableData = {};

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private connector: ConnectorService) {
    this.tableEndpoint$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('table'))
    );
    this.tableEndpoint$.subscribe((endpoint: string) => {
      this.acquireData(endpoint);
    });
  }

  onSubmit(f: NgForm): void {
    console.log(f);
  }

  acquireData(endpoint: string) {
    this.currentTable = endpoint;
    this.connector.get(endpoint).subscribe((response) => {
        console.log('Service responded with ', response);
        this.tableData = this.connector.retrieveData(endpoint, response);
        this.tableKeys = Object.keys(this.tableData[0]);
      },
      error => {
        console.log('ERROR ON OBTAINING RESOURCES FROM ', endpoint);
      });
  }

  get columnLabels(): string[] {
    return DatabaseData.displayColumnNames[this.currentTable];
  }

  get displayTableKeys(): string[] {
    return DatabaseData.displayColumnKeys[this.currentTable];
  }

  get addingColumnLabels(): string [] {
    return DatabaseData.displayColumnNames[this.currentTable].slice(1);
  }

  public cardName(num: number): string {
    return DatabaseData.cardLabels[this.currentTable][num];
  }

  onRefresh() {
    this.acquireData(this.currentTable);
  }
}

