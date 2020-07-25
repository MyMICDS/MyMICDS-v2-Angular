import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {

	transform(value: string, args?: any): any {
		let icons: { [icon: string]: string } = {
			// From forecast.io docuemtnation
			'01d': 'wi-day-sunny',
			'02d': 'wi-day-cloudy',
			'03d': 'wi-cloud',
			'04d': 'wi-cloudy',
			'09d': 'wi-showers',
			'10d': 'wi-day-rain',
			'11d': 'wi-storm-showers',
			'13d': 'wi-snow',
			'50d': 'wi-fog',
			'01n': 'wi-night-clear',
			'02n': 'wi-night-alt-cloudy',
			'03n': 'wi-cloud',
			'04n': 'wi-cloudy',
			'09n': 'wi-showers',
			'10n': 'wi-night-rain',
			'11n': 'wi-storm-showers',
			'13n': 'wi-snow',
			'50n': 'wi-fog'
		};

		return icons[value] || icons['default'];
	}

}
