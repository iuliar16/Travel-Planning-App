import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';
import { IntroComponent } from './intro/intro.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';

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
    path: '**',
    redirectTo: 'intro',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
