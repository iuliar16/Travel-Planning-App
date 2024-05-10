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
import { ViewTripComponent } from './view-trip/view-trip.component';
import { TripSubmittedGuardService } from './services/tripSubmittedGuard/trip-submitted-guard.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'schedule-itinerary',
    component: ScheduleItineraryComponent,
    canActivate: [TripSubmittedGuardService]
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
    canActivate: [AuthGuardService] 
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-info',
    component: EditInfoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'forgot-pass',
    component: ForgotPassComponent,
  },
  {
    path: 'reset-pass',
    component: ResetPassComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'past-trips',
    component: PastTripsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'manage-sharing',
    component: ManageSharingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'confirm-email',
    component: ConfirmAccountComponent,
  },
  {
    path: 'view-trip',
    component: ViewTripComponent,
    canActivate: [AuthGuardService]
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
