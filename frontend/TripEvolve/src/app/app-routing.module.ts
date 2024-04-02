import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';
import { IntroComponent } from './intro/intro.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { PastTripsComponent } from './past-trips/past-trips.component';
import { ManageSharingComponent } from './manage-sharing/manage-sharing.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';

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
    path: 'edit-info',
    component: EditInfoComponent,
  },
  {
    path: 'forgot-pass',
    component: ForgotPassComponent,
  },
  {
    path: 'reset-pass',
    component: ResetPassComponent,
  },
  {
    path: 'past-trips',
    component: PastTripsComponent,
  },
  {
    path: 'manage-sharing',
    component: ManageSharingComponent,
  },
  {
    path: 'confirm-email',
    component: ConfirmAccountComponent,
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
