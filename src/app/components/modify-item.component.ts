import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {DataUtilService} from './data-util.service';
import {map, startWith} from 'rxjs/operators';
import {DatabaseData} from '../connector/database-data';

@Component({
  selector: 'modify-item',
  template: `
      <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmitClicked()">
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
          <button mat-button mat-raised-button (click)="onSubmitClicked()">Submit</button>
      </form>
  `
})
export class ModifyItemComponent implements OnInit {
  private modifiedItem: { [key: string]: string[] };
  private tableKeys: string[];
  private columnLabels: string[];
  @Output() onSubmit: EventEmitter<unknown> = new EventEmitter<unknown>();

  myGroup: FormGroup = new FormGroup({none: new FormControl()});

  @Input('modifiedItem') set tables(inputTablesData) {
    if (inputTablesData) {
      console.log('acquired data: ', inputTablesData.animal);
      this.modifiedItem = inputTablesData.animal;
      this.tableKeys = DatabaseData.modifyItemKeys[inputTablesData.endpoint];
      this.columnLabels = DatabaseData.modifyItemLabels[inputTablesData.endpoint];
    }
  }

  @Input() filterData: { [key: string]: string[] };

  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  constructor(private dataService: DataUtilService) {
  }

  ngOnInit(): void {
    this.tableKeys.forEach(key => {
      this.myGroup.addControl(key, new FormControl(this.modifiedItem[key]));
      this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(key, value))
        );
    });
  }

  private _filter(key: string, value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('filtering ', value, 'for ', this.filterData[key]);

    return this.filterData[key].filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmitClicked(): void {
    if (this.myGroup.valid) {
      this.onSubmit.emit(this.myGroup.value);
    }
    console.log(this.myGroup);
  }
}
