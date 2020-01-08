import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePageComponent} from './components/home-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBar,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {NavigationBarComponent} from './components/nav-bar.component';
import {EditAnimalsComponent} from './components/animals/edit-animals.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DisplayAnimalsComponent} from './components/animals/display-animals.component';
import {DialogDetailsComponent} from './components/animals/dialog-details.component';
import {HttpClientModule} from '@angular/common/http';
import {ConnectorService} from './connector/connector.service';
import {DataUtilService} from './util/data-util.service';
import {SpinnerComponent} from './util/spinner.component';
import {ModifyItemComponent} from './components/animals/modify-item.component';
import {DisplaySpeciesComponent} from './components/animals/display-species.component';
import {EditSpaceComponent} from './components/space/edit-space.component';
import {DisplaySpaceComponent} from './components/space/display-space.component';
import {AccordionModule} from 'primeng/accordion';
import {SpaceDialogComponent} from './components/space/space-dialog.component';
import {MyRoomsComponent} from './components/space/my-rooms.component';
import {RoomsToBuyComponent} from './components/space/rooms-to-buy.component';
import {BuyRoomComponent} from './components/space/buy-room.component';
import {EditCaretakerDialogComponent} from './components/space/edit-caretaker.component';
import {EditEnclosureDialogComponent} from './components/space/edit-enclosure.component';
import {DisplayEnclosureComponent} from './components/space/display-enclosure.component';
import {EditWorkersComponent} from './components/workers/edit-workers.component';
import {DisplayCaretakersComponent} from './components/workers/display-caretakers.component';
import {CaretakersDialogComponent} from './components/workers/caretakers-dialog.component';
import {DisplayEntertainersComponent} from './components/workers/display-entertainers.component';
import {EntertainersDialogComponent} from './components/workers/entertainers-dialog.component';
import {EditBudgetComponent} from './components/budget/edit-budget.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavigationBarComponent,
    EditAnimalsComponent,
    DisplayAnimalsComponent,
    DialogDetailsComponent,
    SpinnerComponent,
    ModifyItemComponent,
    DisplaySpeciesComponent,
    DisplaySpaceComponent,
    SpaceDialogComponent,
    EditSpaceComponent,
    MyRoomsComponent,
    RoomsToBuyComponent,
    BuyRoomComponent,
    EditCaretakerDialogComponent,
    EditEnclosureDialogComponent,
    DisplayEnclosureComponent,
    EditWorkersComponent,
    DisplayCaretakersComponent,
    CaretakersDialogComponent,
    DisplayEntertainersComponent,
    EntertainersDialogComponent,
    EditBudgetComponent
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
    MatDividerModule,
    AccordionModule,
    MatSnackBarModule,
    MatSelectModule,
    MatListModule,
    MatProgressBarModule
  ],
  // tslint:disable-next-line:object-literal-sort-keys
  entryComponents: [
    DialogDetailsComponent, SpaceDialogComponent, EditCaretakerDialogComponent, EditEnclosureDialogComponent,
    CaretakersDialogComponent, EntertainersDialogComponent
  ],
  providers: [ConnectorService, DataUtilService, MatSnackBar],
  bootstrap: [AppComponent]
})
export class AppModule {
}
