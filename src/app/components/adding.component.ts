import {Component, Input, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, NgForm} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: `add-to-table`,
  template: `
      <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
          <ng-container *ngFor="let column of tableColumnNames[currentTable]; let i = index">
              <mat-form-field color="warn" appearance="outline">
                  <mat-label>{{column}}</mat-label>
                  <input matInput ngModel required name="{{tableKeys[i]}}"
                         [formControl]="myGroup.controls[tableKeys[i]]"
                         [formControlName]="tableKeys[i]"
                         [matAutocomplete]="auto">
                  <mat-autocomplete #auto="matAutocomplete">
                      <mat-option *ngFor="let option of filteredOptions[tableKeys[i]] | async" [value]="option">
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
  @Input() tableKeys: string[];
  myGroup: FormGroup = new FormGroup({
    none: new FormControl()
  });
  @Input() tableData: { [key: string]: string[] };
  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  ngOnInit(): void {
    this.tableKeys.forEach(key => {
      this.myGroup.addControl(key, new FormControl());
      this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(key, value))
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
