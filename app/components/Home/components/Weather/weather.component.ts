import {Component} from '@angular/core';
import {NgIf} from '@angular/common';

import {AlertService} from '../../../../services/alert.service';
import {WeatherService} from '../../../../services/weather.service';

import {CompassDirectionPipe} from '../../../../pipes/compass-direction.pipe';
import {RoundPipe} from '../../../../pipes/round.pipe';
import {WeatherIconPipe} from '../../../../pipes/weather-icon.pipe';

@Component({
	selector: 'weather',
	templateUrl: 'app/components/Home/components/Weather/weather.html',
	styleUrls: ['dist/app/components/Home/components/Weather/weather.css'],
	directives: [NgIf],
	providers: [WeatherService],
	pipes: [CompassDirectionPipe, RoundPipe, WeatherIconPipe]
})
export class WeatherComponent {

	constructor(private alertService: AlertService, private weatherService: WeatherService) {}

	ngOnInit() {
		this.subscription = this.weatherService.getWeather().subscribe(
			(data) => {
				this.weather = data;
			},
			(error) => {
				this.alertService.addAlert('danger', 'Get Weather Error!', error);
			}
		);
	}

	ngOnDestroy() {
		// Unsubscribe to prevent memory leaks or something
		this.subscription.unsubscribe();
	}

	weather:any = null;
	subscription:any;
}
