import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DataUtilService} from '../util/data-util.service';

@Component({
  selector: `add-to-table`,
  template: `
      <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
          <ng-container *ngFor="let column of columnLabels; let i = index">
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
  `,
  providers: [DataUtilService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddingComponent implements OnInit, AfterViewChecked {
  // tslint:disable-next-line:variable-name
  private tableData: { [key: string]: string[] };
  private tableKeys: string[];
  private columnLabels: string[] = [];
  myGroup: FormGroup = new FormGroup({none: new FormControl()});

  @Input('tableData') set tables(inputTablesData) {
    this.tableData = this.dataService.parseData(inputTablesData);
    console.log('Table data changed!: ', this.tableData);
  }

  @Input('columnLabels') set data2(columnLabels: string[]) {
    if (this.columnLabels !== columnLabels.slice(1)) {
      this.columnLabels = columnLabels.slice(1);
    }
  }

  @Input() currentTable: string = '';
  // private tableKeys: string[];
  // @Input('tableKeys') set data(tableKeys) {
  //   if (!!tableKeys) {
  //     this.tableKeys = tableKeys;
  //     this.myGroup = new FormGroup({
  //       none: new FormControl()
  //     });
  //     this.tableKeys.forEach(key => {
  //       this.myGroup.addControl(key, new FormControl('', Validators.required));
  //       this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
  //         .pipe(
  //           startWith(''),
  //           map(value => this._filter(key, value))
  //         );
  //     });
  //   } else {
  //     this.tableKeys = [];
  //   }
  // }
  @Input('tableKeys') set data(tableKeys: string[]) {
    if (this.tableKeys !== tableKeys.slice(1)) {
      console.log('Setting table keys: ', tableKeys.slice(1));
      this.tableKeys = tableKeys.slice(1);
    }
  }

  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  constructor(private cdRef: ChangeDetectorRef, private dataService: DataUtilService) {
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

  private _filter(key: string, value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('filtering ', value, 'for ', this.tableData[key]);

    return this.tableData[key].filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    console.log(this.myGroup);
  }

}
