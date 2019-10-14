import {Component, Input, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, NgForm} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: `add-to-table`,
  template: `
      <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
          <ng-container *ngFor="let column of tableColumnNames[currentTable]; let key of keys[currentTable]">
              <mat-form-field color="warn" appearance="outline">
                  <mat-label>{{column}}</mat-label>
                  <input matInput ngModel required name="{{column.toLocaleLowerCase()}}"
                         [formControl]="myGroup.controls[column.toLocaleLowerCase()]"
                         [formControlName]="column.toLocaleLowerCase()"
                         [matAutocomplete]="auto">
                  <mat-autocomplete #auto="matAutocomplete">
                      <mat-option *ngFor="let option of filteredOptions[column.toLocaleLowerCase()] | async" [value]="option">
                          {{option}}
                      </mat-option>
                  </mat-autocomplete>
              </mat-form-field>
          </ng-container>
          <mat-error *ngIf="myGroup.invalid" style="padding-bottom: 1rem">Uzupełnij wymagane pola!</mat-error>
          <button mat-button mat-raised-button>Submit</button>
      </form>
  `
})
export class AddingComponent implements OnInit {
  @Input() tableColumnNames: { [key: string]: string[] };
  @Input() currentTable: string;
  tableKeys: string[] = ['name', 'species', 'roomId'];
  myGroup: FormGroup = new FormGroup({
    none: new FormControl()
  });
  tableData: { [key: string]: string[] } = {
    name: ['Piesel 1', 'Piesel 2'],
    species: ['Dog', 'Elephant'],
    'room id': ['15', '16', '17']
  };
  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  ngOnInit(): void {
    this.tableColumnNames[this.currentTable].forEach(key => {
      this.myGroup.addControl(key.toLocaleLowerCase(), new FormControl());
      this.filteredOptions[key.toLocaleLowerCase()] = this.myGroup.controls[key.toLocaleLowerCase()].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(key.toLocaleLowerCase(), value))
        );
    });

  }

  private _filter(key: string, value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('filtering ', value, 'for ', this.tableData[key]);

    return this.tableData[key].filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    console.log(this.myGroup.value);
  }

}
