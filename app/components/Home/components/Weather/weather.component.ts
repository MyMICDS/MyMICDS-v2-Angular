import {Component} from '@angular/core';
import {NgIf} from '@angular/common';

import {WeatherService} from '../../../../services/weather.service';

import {CompassDirection} from '../../../../pipes/compass-direction.pipe';
import {WeatherIcon} from '../../../../pipes/weather-icon.pipe';

@Component({
	selector: 'weather',
	templateUrl: 'app/components/Home/components/Weather/weather.html',
	styleUrls: ['dist/app/components/Home/components/Weather/weather.css'],
	directives: [NgIf],
	providers: [WeatherService],
	pipes: [CompassDirection, WeatherIcon]
})
export class WeatherComponent {
	weather:any = null;

	constructor(weatherService: WeatherService) {
		weatherService.getWeather().subscribe(
			(data) => {
				this.weather = data;
			},
			(error) => {
				console.error('Weather error!', error);
			}
		);
	}
}
