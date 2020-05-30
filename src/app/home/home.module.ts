import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMICDS, MyMICDSModule, MyMICDSModuleType } from '@mymicds/sdk';

import { HomeComponent } from "./home/home.component";

import { moduleComponents } from './modules/module-config';

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

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home.routing';

@NgModule({
  declarations: [
    HomeComponent,
    moduleComponents,
    BookmarksComponent,
    CountdownComponent,
    GpaCalculatorComponent,
    ProgressComponent,
    ScheduleComponent,
    SimplifiedScheduleComponent,
    SnowdayComponent,
    StickynotesComponent,
    SimplifiedLunchComponent,
    TwitterComponent,
    WeatherComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ],
  entryComponents: moduleComponents
})
export class HomeModule { }
