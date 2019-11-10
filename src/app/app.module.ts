import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HomePageComponent} from './components/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule, MatDialogModule, MatDividerModule,
  MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSidenavModule, MatSortModule, MatTableModule, MatTabsModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {NavigationBarComponent} from './components/nav-bar.component';
import {EditDatabaseComponent} from './components/edit-database.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddingComponent} from './components/adding.component';
import {ModifyComponent} from './components/modify.component';
import {DialogDetailsComponent} from './components/dialog-details.component';
import {HttpClientModule} from '@angular/common/http';
import {ConnectorService} from './connector/connector.service';
import {DataUtilService} from './components/data-util.service';
import {SpinnerComponent} from './components/spinner.component';
import {ModifyItemComponent} from './components/modify-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavigationBarComponent,
    EditDatabaseComponent,
    AddingComponent,
    ModifyComponent,
    DialogDetailsComponent,
    SpinnerComponent,
    ModifyItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatGridListModule,
    MatTabsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule
  ],
  // tslint:disable-next-line:object-literal-sort-keys
  entryComponents: [
    DialogDetailsComponent
  ],
  providers: [ConnectorService, DataUtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
