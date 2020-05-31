import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { BookmarksComponent } from './modules/bookmarks/bookmarks.component';
import { CountdownComponent } from './modules/countdown/countdown.component';
import { GpaCalculatorComponent } from './modules/gpa-calculator/gpa-calculator.component';
import { ProgressComponent } from './modules/progress/progress.component';
import { ScheduleComponent } from './modules/schedule/schedule.component';
import { SimplifiedScheduleComponent } from './modules/simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './modules/snowday/snowday.component';
import { StickynotesComponent } from './modules/stickynotes/stickynotes.component';
import { SimplifiedLunchComponent } from './modules/simplified-lunch/simplified-lunch.component';
import { TwitterComponent } from './modules/twitter/twitter.component';
import { WeatherComponent } from './modules/weather/weather.component';

import { ModuleOptionsComponent } from './module-options/module-options.component';
import { ModuleContainerComponent } from './module-container/module-container.component';
import { ModuleOptionComponent } from './module-options/module-option/module-option.component';
import { ModuleInspectorComponent } from './module-inspector/module-inspector.component';
import { moduleComponents, config } from './modules/module-config';

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
    ModuleOptionsComponent,
    ModuleContainerComponent,
    ModuleOptionComponent,
    moduleComponents,
    BookmarksComponent,
    CountdownComponent,
    GpaCalculatorComponent,
    ProgressComponent,
    ScheduleComponent,
    SimplifiedScheduleComponent,
    StickynotesComponent,
    SnowdayComponent,
    SimplifiedLunchComponent,
    TwitterComponent,
    WeatherComponent,
    ModuleInspectorComponent,

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
    WeatherIconPipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    SharedRoutingModule
  ],
  entryComponents: moduleComponents,
  exports: [
    ModuleInspectorComponent,
    ModuleContainerComponent,
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
    WeatherIconPipe
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}
