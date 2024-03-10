import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';
import { IntroComponent } from './intro/intro.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';

const routes: Routes = [
  {
    path: 'schedule-itinerary',
    component: ScheduleItineraryComponent,
  },
  {
    path: 'intro',
    component: IntroComponent,
  },
  {
    path: 'sign-up',
    component: AuthComponent,
  },
  {
    path: 'sign-in',
    component: LoginComponent,
  },
  {
    path: 'add-trip',
    component: AddTripComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
  },
  {
    path: '**',
    redirectTo: 'intro',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
