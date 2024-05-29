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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomeComponent } from './home/home.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TripCardComponent } from './home/trip-card/trip-card.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { PastTripsComponent } from './past-trips/past-trips.component';
import { ManageSharingComponent } from './manage-sharing/manage-sharing.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareTripPopupComponent } from './share-trip-popup/share-trip-popup.component';
import { PublicShareComponent } from './public-share/public-share.component';
import { DeleteTripPopupComponent } from './delete-trip-popup/delete-trip-popup.component';
import { SignOutPopupComponent } from './sign-out-popup/sign-out-popup.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { MatSliderModule } from '@angular/material/slider';
import { ViewTripComponent } from './view-trip/view-trip.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
    TripCardComponent,
    MyAccountComponent,
    ForgotPassComponent,
    ResetPassComponent,
    SubHeaderComponent,
    PastTripsComponent,
    ManageSharingComponent,
    ShareTripPopupComponent,
    PublicShareComponent,
    DeleteTripPopupComponent,
    SignOutPopupComponent,
    ConfirmAccountComponent,
    ViewTripComponent,
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
    MatDatepickerModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSnackBarModule,
  ],
  providers: [
    provideClientHydration(),
    provideNativeDateAdapter(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
