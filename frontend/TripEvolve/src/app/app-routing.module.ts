import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';

const routes: Routes = [
  {
    path: 'schedule-itinerary',
    component: ScheduleItineraryComponent,
  },
  // {
  //   path: '**',
  //   redirectTo: 'intro',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
