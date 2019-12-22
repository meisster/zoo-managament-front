import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConnectorService} from '../../connector/connector.service';
import {DatabaseData} from '../../util/database-data';

@Component({
  selector: `edit-space`,
  template: `
    <div class="content-wrapper">
      <mat-grid-list cols="1" rowHeight="40px">
        <mat-grid-tile style="font-size: 20px">{{ ('workers').toLocaleUpperCase() }}</mat-grid-tile>
        <spinner [showSpinner]="showSpinner"></spinner>
      </mat-grid-list>
      <mat-divider style="margin: 10px 0;"></mat-divider>
      <mat-tab-group>
        <mat-tab label="{{ cardName(0) }}">
          <display-caretakers></display-caretakers>
        </mat-tab>
        <mat-tab label="{{ cardName(1) }}">
          <display-entertainers></display-entertainers>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  // tslint:disable-next-line:object-literal-sort-keys
  providers: [ConnectorService]

})
export class EditWorkersComponent {
  public static readonly ENDPOINT: string = 'workers';

  showSpinner: boolean = false;
  tableKeys: string[] = [];
  tableData = {};

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private connector: ConnectorService) {
    this.showSpinner = true;
    setTimeout(() => this.showSpinner = false, 500);
  }

  public cardName(num: number): string {
    return DatabaseData.cardLabels['workers'][num];
  }
}

