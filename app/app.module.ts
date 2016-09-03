import * as config from './common/config';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { routing } from './app.routing'

import {AuthHttp, AuthConfig, JwtHelper, AUTH_PROVIDERS, provideAuth} from 'angular2-jwt';
let jwtHelper = new JwtHelper();
import {WEB_STORAGE_PROVIDERS} from 'h5webstorage';
import {Title} from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {NavbarComponent} from './components/Navbar/navbar.component';
import {AlertComponent} from './components/Alert/alert.component';
import {HomeComponent} from './components/Home/home.component';
import {ProgressComponent} from './components/Home/components/Progress/progress.component';
import {ScheduleComponent} from './components/Home/components/Schedule/schedule.component';
import {WeatherComponent} from './components/Home/components/Weather/weather.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {PlannerComponent} from './components/Planner/planner.component';
import {DailyBulletinComponent} from './components/DailyBulletin/daily-bulletin.component';
import {BulletinArchivesComponent} from './components/BulletinArchives/bulletin-archives.component';
import {SettingsComponent} from './components/Settings/settings.component';
import {AboutComponent} from './components/About/about.component';
import {HelpComponent} from './components/Help/help.component';
import {LoginComponent} from './components/Login/login.component';
import {LogoutComponent} from './components/Logout/logout.component';
import {RegisterComponent} from './components/Register/register.component';
import {ConfirmComponent} from './components/Confirm/confirm.component';
import {ForgotPasswordComponent} from './components/ForgotPassword/forgot-password.component';
import {ResetPasswordComponent} from './components/ResetPassword/reset-password.component';

import {NgFor, NgIf, NgStyle} from '@angular/common';
import {BlurDirective, WhiteBlurDirective, DarkBlurDirective} from './directives/blur.directive';
import {FaComponent} from 'angular2-fontawesome/components';
import {DATEPICKER_DIRECTIVES, MODAL_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {SafeResourceUrlPipe} from './pipes/safe.pipe';
import {DayRotationPipe} from './pipes/day-rotation.pipe';
import {SchoolPercentagePipe} from './pipes/school-percentage.pipe';
import {CompassDirectionPipe} from './pipes/compass-direction.pipe';
import {RoundPipe} from './pipes/round.pipe';
import {WeatherIconPipe} from './pipes/weather-icon.pipe';
import {ValuesPipe} from './pipes/values.pipe';
import {ColorPickerDirective} from 'ct-angular2-color-picker/component';


@NgModule({
  imports: [ 
    BrowserModule, 
    HttpModule, 
    FormsModule,
    routing
    ],       // module dependencies
  declarations: [ 
    //components
    AppComponent,
    NavbarComponent,         HomeComponent,          LunchComponent,
    PlannerComponent,        DailyBulletinComponent, BulletinArchivesComponent,
    SettingsComponent,       AboutComponent,         HelpComponent,
    LoginComponent,          LogoutComponent,        RegisterComponent,
    ConfirmComponent,        ForgotPasswordComponent, ResetPasswordComponent,
    //directives
    NgFor,                   NgIf,                   NgStyle, 
    BlurDirective,           FaComponent,            DarkBlurDirective,
    WhiteBlurDirective,      DATEPICKER_DIRECTIVES,  MODAL_DIRECTIVES,
    //pipes
    SafeResourceUrlPipe,     DayRotationPipe,        SchoolPercentagePipe, 
    CompassDirectionPipe,    RoundPipe,              WeatherIconPipe,
    ValuesPipe,              ColorPickerDirective,   
    ],
  providers: [
    Title,
    WEB_STORAGE_PROVIDERS,
    {
        provide: AuthHttp,
        useFactory: (http) => {
                return new AuthHttp(new AuthConfig({
                    tokenGetter: () => {
                        // Look in session storage for id_token, but fallback to local storage
                        let session = sessionStorage.getItem('id_token');
                        let local = localStorage.getItem('id_token');

                        let token = session || local;

                        // Remove any quotations from the sides
                        if(typeof token === 'string') {
                            token = token.split('"').join('');

                            // Check if token is expired. If it is, delete and send user to login page
                            if(jwtHelper.isTokenExpired(token)) {
                                this.sessionStorage.removeItem('id_token');
                                this.localStorage.removeItem('id_token');

                                this.router.navigate(['/login']);
                                return null;
                            }
                        }

                        return token;
                    },
                    noJwtError: true
                }), http);
            },
        deps: [Http]
    }

    ],                    // services
    bootstrap: [ AppComponent ],     // root component
})
export class AppModule { }