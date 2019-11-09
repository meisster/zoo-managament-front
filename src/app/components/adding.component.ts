import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: `add-to-table`,
  template: `
    <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
      <ng-container *ngFor="let column of tableColumnNames[currentTable]; let i = index">
        <mat-form-field color="warn" appearance="outline">
          <mat-label>{{column}}</mat-label>
          <input matInput name="{{tableKeys[i]}}"
                 [formControl]="myGroup.controls[tableKeys[i]]"
                 [formControlName]="tableKeys[i]"
                 [matAutocomplete]="auto">
                  <mat-error *ngIf="myGroup.controls[tableKeys[i]].invalid" style="font-size: 12px">Fill the required field!</mat-error>
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of filteredOptions[tableKeys[i]] | async" [value]="option">
              {{option}}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </ng-container>
      <mat-divider style="margin: 1rem 0"></mat-divider>
      <button mat-button mat-raised-button>Submit</button>
    </form>
  `
})
export class AddingComponent implements OnInit, AfterViewChecked {
  // tslint:disable-next-line:variable-name
  private tableKeys: string[];
  private tableData: { [key: string]: string[] };
  myGroup: FormGroup = new FormGroup({none: new FormControl()});

  @Input('tableData') set tables(inputTablesData) {
    if (!!inputTablesData) {
      this.tableData = this.parseData(inputTablesData);
      console.log('Table data changed!: ', this.tableData);
    }
  }

  @Input() tableColumnNames: { [key: string]: string[] };
  @Input() currentTable: string;

  @Input('tableKeys') set data(tableKeys) {
    if (!!tableKeys) {
      this.tableKeys = tableKeys;
      this.myGroup = new FormGroup({
        none: new FormControl()
      });
      this.tableKeys.forEach(key => {
        this.myGroup.addControl(key, new FormControl('', Validators.required));
        this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(key, value))
          );
      });
    }
  }

  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.tableKeys.forEach(key => {
      this.myGroup.addControl(key, new FormControl('', Validators.required));
      this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(key, value))
        );
    });

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  parseData(data) {
    if (!!data) {
      const res: { [key: string]: string[] } = {};
      Object.keys(data[0]).forEach(key => {
        res[key] = data.map(el => String(el[key]));
      });
      return res;
    }
  }

  private _filter(key: string, value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('filtering ', value, 'for ', this.tableData[key]);

    return this.tableData[key].filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    console.log(this.myGroup);
  }

}
