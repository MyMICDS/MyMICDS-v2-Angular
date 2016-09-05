import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common'
import {SharedModule} from '../../shared.module';
import {HomeComponent} from './home.component';
import {ProgressComponent} from './components/Progress/progress.component';
import {ScheduleComponent} from './components/Schedule/schedule.component';
import {WeatherComponent} from './components/Weather/weather.component';

@NgModule ({
    imports: [SharedModule, CommonModule],
    declarations: [HomeComponent, ProgressComponent, ScheduleComponent, WeatherComponent]
})
export class HomeModule {}