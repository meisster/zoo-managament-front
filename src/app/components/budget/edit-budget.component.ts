import {Component} from '@angular/core';
import {ConnectorService} from '../../connector/connector.service';

@Component({
  selector: 'edit-budget',
  template: `
    <div class="content-wrapper">
      <spinner [showSpinner]="showSpinner"></spinner>
      <h1 style="text-align: center">Control Panel</h1>
      <mat-divider style="margin: 10px 0;"></mat-divider>
      <button mat-button [matTooltip]="'Beware! This will reset everything!'" (click)="startNewGame()">
        Start a new game
        <mat-icon>power_settings_new</mat-icon>
      </button>
      <button mat-button (click)="nextRound()">Next round
        <mat-icon>navigate_next</mat-icon>
      </button>
      <button mat-button (click)="refresh()">Refresh statistics
        <mat-icon>autorenew</mat-icon>
      </button>
      <mat-divider style="margin: 10px 0;"></mat-divider>
      <h1 style="text-align: center">Statistics</h1>
      <mat-list>
        <mat-list-item><p style="text-align: center; width: 100%">Round date: {{this.statistics?.roundDate | date}}</p></mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>Ticket price: {{this.statistics?.ticketPrice}}</mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>Available funds:
          <mat-progress-bar
            [matTooltip]="this.statistics?.availableFunds"
            style="margin-left: 16px; width: 400px"
            [mode]="mode"
            [value]="fundsValue"></mat-progress-bar>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>European funds:
          <mat-progress-bar
            [matTooltip]="this.statistics?.euFunds"
            style="margin-left: 16px; width: 400px"
            [mode]="mode"
            [value]="euFundsValue"></mat-progress-bar>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>Happiness rate:
          <mat-progress-bar
            [matTooltip]="this.statistics?.happinessRate"
            style="margin-left: 16px; width: 400px"
            [mode]="mode"
            [value]="happinessRate"></mat-progress-bar>
        </mat-list-item>
      </mat-list>
    </div>
  `
})
export class EditBudgetComponent {

  statistics: any;
  showSpinner: boolean;

  constructor(private connector: ConnectorService) {
    this.showSpinner = true;
    setTimeout(() => this.showSpinner = false, 1000);
    this.connector.refresh().subscribe(response => {
      this.statistics = response[response.length - 1];
    });
  }

  get fundsValue(): number {
    if (this.statistics && this.statistics.availableFunds) {
      return this.statistics.availableFunds / 10000;
    }
  }

  get mode(): string {
    if (this.statistics && this.statistics.availableFunds) {
      return 'determinate';
    } else {
      return 'indeterminate';
    }
  }

  get euFundsValue(): number {
    if (this.statistics && this.statistics.euFunds) {
      return this.statistics.euFunds / 1000;
    }
  }


  get happinessRate(): number {
    if (this.statistics && this.statistics.happinessRate) {
      return this.statistics.happinessRate;
    }
  }


  startNewGame() {

    this.connector.startNewGame().subscribe(response => this.statistics = response);
  }

  refresh() {
    this.connector.refresh().subscribe(response => {
      this.statistics = response[response.length - 1];
    });
  }

  nextRound() {
    this.connector.nextRound().subscribe(response => this.statistics = response);
  }
}
