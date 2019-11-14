import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './components/home-page.component';
import {EditAnimalsComponent} from './components/animals/edit-animals.component';
import {EditSpaceComponent} from './components/space/edit-space.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    data: {title: 'Welcome to zoo managament app!'}
  },
  {
    path: 'edit/animals',
    component: EditAnimalsComponent,
  },
  {
    path: 'edit/space',
    component: EditSpaceComponent
  },
  {
    path: 'edit/budget',
    component: HomePageComponent
  },
  {
    path: 'edit/workers',
    component: HomePageComponent
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
