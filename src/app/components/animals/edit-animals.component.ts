import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';

@Component({
  selector: `edit-animals`,
  template: `
      <div class="content-wrapper">
          <mat-grid-list cols="1" rowHeight="40px">
              <mat-grid-tile style="font-size: 20px">{{ ('Displaying animals').toLocaleUpperCase() }}</mat-grid-tile>
              <spinner *ngIf="this.showSpinner"></spinner>
          </mat-grid-list>
          <mat-divider style="margin: 10px 0;"></mat-divider>
          <mat-tab-group>
              <mat-tab label="{{ cardName(0) }}">
                  <display-animals></display-animals>
              </mat-tab>
              <mat-tab label="{{ cardName(1) }}">
                  <display-species></display-species>
              </mat-tab>
          </mat-tab-group>
      </div>
  `,
  // tslint:disable-next-line:object-literal-sort-keys
  providers: [ConnectorService]

})
export class EditAnimalsComponent {
  public static readonly ENDPOINT: string = 'animals';

  showSpinner: boolean = false;
  tableKeys: string[] = [];
  tableData = {};

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private connector: ConnectorService) {
    this.showSpinner = true;
    setTimeout(() => this.showSpinner = false, 500);
  }



  get columnLabels(): string[] {
    return DatabaseData.displayColumnNames[EditAnimalsComponent.ENDPOINT];
  }

  get displayTableKeys(): string[] {
    return DatabaseData.displayColumnKeys[EditAnimalsComponent.ENDPOINT];
  }

  public cardName(num: number): string {
    return DatabaseData.cardLabels[EditAnimalsComponent.ENDPOINT][num];
  }
}
