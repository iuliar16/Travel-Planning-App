import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ScheduleItineraryComponent } from './schedule-itinerary/schedule-itinerary.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { IntroComponent } from './intro/intro.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomeComponent } from './home/home.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { WhereAreYouTravellingComponent } from './where-are-you-travelling/where-are-you-travelling.component';
import { WhenDoYouWantToGoComponent } from './when-do-you-want-to-go/when-do-you-want-to-go.component';
import { HowDoYouWantToSpendYourTimeComponent } from './how-do-you-want-to-spend-your-time/how-do-you-want-to-spend-your-time.component';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleItineraryComponent,
    HeaderComponent,
    IntroComponent,
    AuthComponent,
    LoginComponent,
    HomeComponent,
    AddTripComponent,
    WhereAreYouTravellingComponent,
    WhenDoYouWantToGoComponent,
    HowDoYouWantToSpendYourTimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCheckboxModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
