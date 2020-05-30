import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMICDS, MyMICDSModule, MyMICDSModuleType } from '@mymicds/sdk';

import { HomeComponent } from "./home/home.component";

import { ModuleOptionsComponent } from './module-options/module-options.component';
import { ModuleContainerComponent } from './module-container/module-container.component';
import { ModuleOptionComponent } from './module-options/module-option/module-option.component';

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


@NgModule({
  declarations: [
    HomeComponent,
    ModuleOptionComponent,
    ModuleContainerComponent,
    moduleComponents,
    ModuleOptionsComponent,
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
    CommonModule
  ],
  entryComponents: moduleComponents
})
export class HomeModule { }
