import {Component} from '@angular/core';
import {WeatherService} from '../../../../services/weather.service';

@Component({
	selector: 'weather',
	templateUrl: 'app/components/Home/components/Weather/weather.html',
	styleUrls: ['dist/app/components/Home/components/Weather/weather.css'],
	providers: [WeatherService]
})
export class WeatherComponent {
	weather:any;

	constructor(weatherService: WeatherService) {
		weatherService.getWeather().subscribe(
			(data) => {
				this.weather = data;
				console.log('Got weather!');
			},
			(error) => {
				console.error('Weather error!', error);
			}
		);
	}
}
