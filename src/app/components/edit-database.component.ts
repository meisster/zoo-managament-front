import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Animal} from '../Types/ResponseTypes';

@Component({
  selector: `edit-database`,
  template: `
    <div class="content-wrapper">
      <mat-grid-list cols="1" rowHeight="40px">
        <mat-grid-tile>Displaying {{ currentTable }}</mat-grid-tile>
      </mat-grid-list>
      <mat-tab-group>
        <mat-tab label="Add to table">
          <add-to-table [tableColumnNames]="tableColumnNames"
                        [currentTable]="currentTable"
                        [tableKeys]="tableKeys"
                        [tableData]="tableData"></add-to-table>
        </mat-tab>
        <mat-tab label="Modify table">
          <modify [columns]="tableKeys" [dataSource]="tableData"></modify>
        </mat-tab>
      </mat-tab-group>
    </div>
  `
})
export class EditDatabaseComponent {
  table$;
  tableColumnNames: { [key: string]: string[] } = {
    animals: ['Id', 'Name', 'Species name', 'Room ID'],
    rooms: ['Name', 'Surface', 'Price']
  };

  currentTable: string = '';
  tableKeys: string[] = [];
  tableData = {};

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.table$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('table'))
    );
    this.table$.subscribe(
      (next: string) => {
        this.currentTable = (next);
        this.http.get('http://localhost:8080/animals').subscribe((response: Animal[]) => {
          this.tableData = response.map(value => {
            return {
              id: value.id,
              name: value.name,
              species: value.species.name,
              roomId: value.room.id
            };
          });
          this.tableKeys = Object.keys(this.tableData[0]);
        });
      }
    );
  }
}

