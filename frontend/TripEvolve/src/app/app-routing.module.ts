import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';
import { IntroComponent } from './intro/intro.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { WhereAreYouTravellingComponent } from './where-are-you-travelling/where-are-you-travelling.component';
import { WhenDoYouWantToGoComponent } from './when-do-you-want-to-go/when-do-you-want-to-go.component';
import { HowDoYouWantToSpendYourTimeComponent } from './how-do-you-want-to-spend-your-time/how-do-you-want-to-spend-your-time.component';

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
    path: 'addTrip-location',
    component: WhereAreYouTravellingComponent
  },
  {
    path: 'addTrip-dates',
    component: WhenDoYouWantToGoComponent
  },
  {
    path: 'addTrip-spendtime',
    component: HowDoYouWantToSpendYourTimeComponent
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
