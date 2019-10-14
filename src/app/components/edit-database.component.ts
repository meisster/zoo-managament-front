import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';

@Component({
  selector: `edit-database`,
  template: `
      <div class="content-wrapper">
          <mat-grid-list cols="1" rowHeight="40px">
              <mat-grid-tile>Displaying {{ currentTable }}</mat-grid-tile>
          </mat-grid-list>
          <mat-tab-group>
              <mat-tab label="Add to table">
                  <add-to-table [tableColumnNames]="tableColumns"
                                [currentTable]="currentTable"
                                [tableKeys]="tableKeys"
                                [tableData]="tablesData"></add-to-table>
              </mat-tab>
              <mat-tab label="Modify table">
                  <modify [columns]="tableKeys" [dataSource]="tableData"></modify>
              </mat-tab>
          </mat-tab-group>
      </div>
  `
})
export class EditDatabaseComponent implements OnInit {
  table$;
  tableColumns: { [key: string]: string[] } = {
    animals: ['Name', 'Species', 'Room ID'],
    rooms: ['Name', 'Surface', 'Price']
  };
  currentTable: string;
  tableKeys: string[];
  tableData;

  tablesData: { [key: string]: string[] } = {
    name: ['Piesel 1', 'Piesel 2'],
    species: ['Dog', 'Elephant'],
    roomId: ['15', '16', '17']
  };

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.table$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('table'))
    );
    this.table$.subscribe(
      (next: string) => {
        this.currentTable = (next);
        this.tableKeys = this.currentTable === 'animals' ? ['name', 'species', 'roomId'] : ['name', 'surface', 'price'];
        this.tablesData = this.currentTable === 'animals' ? {
          name: ['Piesel 1', 'Piesel 2'],
          species: ['Dog', 'Elephant'],
          roomId: ['15', '16', '17']
        } : {
          name: ['Pokoj 1', 'Pokoj 2'],
          surface: ['100', '200', '300'],
          price: ['15', '25', '35']
        };
        this.tableData = this.currentTable === 'animals' ? [
          {
            name: 'Slonik',
            species: 'Elephant',
            roomId: 16,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, officia.'
          },
          {
            name: 'Doge',
            species: 'Dog',
            roomId: 15,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, officia.'
          }
        ] : [
          {
            name: 'Pokoj 1',
            surface: 255,
            price: 50,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, officia.'
          },
          {
            name: 'Pokoj 2',
            surface: 128,
            price: 100,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, officia.'
          }
        ];
      }
    );
  }

  onSubmit(f: NgForm): void {
    console.log(f);
  }
}

