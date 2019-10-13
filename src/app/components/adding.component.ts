import {Component, Input} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';

@Component({
  selector: `add-to-table`,
  template: `
      <form #f="ngForm" (ngSubmit)="onSubmit(f)"  class="input-container">
          <ng-container *ngFor="let tableColumn of tablesData[editingTable]">
              <mat-form-field color="warn" appearance="outline">
                  <mat-label>{{tableColumn}}</mat-label>
                  <input matInput ngModel required name="{{tableColumn.toLocaleLowerCase()}}">
              </mat-form-field>
          </ng-container>
          <mat-error *ngIf="f.invalid" style="padding-bottom: 1rem">Uzupełnij wymagane pola!</mat-error>
          <button mat-button mat-raised-button>Submit</button>
      </form>
  `
})
export class AddingComponent {
  @Input() tablesData: { [key: string]: string[] };
  @Input() editingTable: string;

  onSubmit(f: NgForm): void {
    console.log(f);
  }

}
