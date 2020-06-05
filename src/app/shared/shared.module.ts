import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { NavbarComponent } from './navbar/navbar.component';
import { BlurDirective,
	DarkBlurDirective,
	WhiteBlurDirective } from './directives/blur.directive';

import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CompassDirectionPipe } from './pipes/compass-direction.pipe';
import { DayRotationPipe } from './pipes/day-rotation.pipe';
import { GradePipePipe } from './pipes/grade-pipe.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { SafeHtmlPipe, SafeResourceUrlPipe, SafeScriptPipe, SafeStylePipe, SafeUrlPipe } from './pipes/safe.pipe';
import { SchoolPercentagePipe } from './pipes/school-percentage.pipe';
import { ValuesPipe } from './pipes/values.pipe';
import { WeatherIconPipe } from './pipes/weather-icon.pipe';
import { MomentDatePipe } from './pipes/moment-date.pipe';

import { SharedRoutingModule } from './shared.routing' ;

@NgModule({
  declarations: [
    NavbarComponent,

    // Pipes
    CapitalizePipe,
    CompassDirectionPipe,
    DayRotationPipe,
    GradePipePipe,
    MomentDatePipe,
    RoundPipe,
    SafeHtmlPipe,
    SafeScriptPipe,
    SafeStylePipe,
    SafeUrlPipe,
    SafeResourceUrlPipe,
    SchoolPercentagePipe,
    ValuesPipe,
    WeatherIconPipe,

		//Directives
		BlurDirective,
		DarkBlurDirective,
		WhiteBlurDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
		// FormsModule,
		// BrowserModule,
    SharedRoutingModule,
  ],
  exports: [
    CapitalizePipe,
    CompassDirectionPipe,
    DayRotationPipe,
    GradePipePipe,
    MomentDatePipe,
    RoundPipe,
    SafeHtmlPipe,
    SafeScriptPipe,
    SafeStylePipe,
    SafeUrlPipe,
    SafeResourceUrlPipe,
    SchoolPercentagePipe,
    ValuesPipe,
    WeatherIconPipe,
    NavbarComponent,
		BlurDirective,
		DarkBlurDirective,
		WhiteBlurDirective
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}
