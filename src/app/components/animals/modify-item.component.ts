import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {DataUtilService} from '../../util/data-util.service';
import {map, startWith} from 'rxjs/operators';
import {DatabaseData} from '../../util/database-data';
import {ConnectorService} from '../../connector/connector.service';

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
          <mat-error *ngIf="myGroup.controls[tableKeys[i]]?.invalid" style="font-size: 12px">Fill the required field!</mat-error>
          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let option of filteredOptions[tableKeys[i]] | async" [value]="option">
              {{option}}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </ng-container>
      <mat-divider style="margin: 1rem 0"></mat-divider>
      <button mat-button mat-flat-button>Submit</button>
    </form>
  `,
  providers: [ConnectorService]
})
export class ModifyItemComponent implements OnInit {
  private modifiedItem: { [key: string]: string };
  private tableKeys: string[];
  private columnLabels: string[];
  @Input() filterKeys: string[];
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

  constructor(private dataService: DataUtilService, private connector: ConnectorService) {
  }

  ngOnInit(): void {
    this.tableKeys.forEach(key => {
      this.myGroup.addControl(key, new FormControl(this.modifiedItem[key], Validators.required));
    });
    this.connector.getRoomsBySpecies((this.modifiedItem.species || this.modifiedItem.name)).subscribe(
      (rooms: string[]) => {
        this.filterData = {
          roomId: rooms
        };
        console.log('ROOMS: ', this.filterData);
        this.tableKeys.forEach(key => {
          this.myGroup.addControl(key, new FormControl(this.modifiedItem[key], Validators.required));
        });
        console.log('filter keys', this.filterKeys);
        this.filterKeys.forEach(key => {
          this.filteredOptions[key] = this.myGroup.controls[key].valueChanges
            .pipe(
              startWith(''),
              map(value => this._filter(key, value))
            );
        });
      });
  }

  private _filter(key: string, value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    console.log('filtering ', value, 'for ', this.filterData);

    return this.filterData[key].filter(option => option.toString().toLowerCase().includes(filterValue));
  }

  onSubmitClicked(): void {
    if (this.myGroup.valid) {
      this.onSubmit.emit(
        {
          values: this.myGroup.value,
          id: this.modifiedItem.id
        });
    }
    console.log(this.myGroup);
  }
}
