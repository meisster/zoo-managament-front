import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './components/home-page.component';
import {EditDatabaseComponent} from './components/edit-database.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    data: {title: 'Welcome to zoo managament app!'}
  },
  {
    path: 'edit/:table',
    component: EditDatabaseComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
