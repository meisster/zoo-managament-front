import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './components/home-page.component';
import {EditAnimalsComponent} from './components/animals/edit-animals.component';
import {EditSpaceComponent} from './components/space/edit-space.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    data: {
      title: 'Welcome to zoo managament app!',
      animation: 'changePage'
    },
  },
  {
    path: 'edit/animals',
    component: EditAnimalsComponent,
    data: {animation: 'changePage'}
  },
  {
    path: 'edit/space',
    component: EditSpaceComponent,
    data: {animation: 'changePage'}
  },
  {
    path: 'edit/budget',
    component: HomePageComponent,
    data: {animation: 'changePage'}
  },
  {
    path: 'edit/workers',
    component: HomePageComponent,
    data: {animation: 'changePage'}
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {animation: 'changePage'}

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
