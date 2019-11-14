import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'buy-room',
  template: `
      <form class="input-container" [formGroup]="myGroup" (ngSubmit)="onSubmit()">
          <mat-form-field color="warn" appearance="outline">
              <mat-label>Localization</mat-label>
              <input type="text" name="localization" matInput formControlName="localization" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete">
                  <mat-option *ngFor="let option of filteredOptions | async" [value]="option"></mat-option>
              </mat-autocomplete>
              <mat-error *ngIf="myGroup.controls.localization.invalid" style="font-size: 12px">Fill the required field!</mat-error>
          </mat-form-field>
          <mat-divider style="margin: 1rem 0"></mat-divider>
          <button mat-button mat-flat-button>Submit</button>
      </form>
  `,
  providers: [ConnectorService]
})
export class BuyRoomComponent implements OnInit {
  myGroup = new FormGroup({localization: new FormControl('', Validators.required)});
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  @Input() dialogData;
  @Output() response: EventEmitter<string> = new EventEmitter<string>();

  constructor(private connector: ConnectorService) {
  }

  ngOnInit() {
    this.filteredOptions = this.myGroup.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.myGroup);

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    if (this.myGroup.valid) {
      this.response.emit(this.myGroup.value.localization);
    }
  }
}
