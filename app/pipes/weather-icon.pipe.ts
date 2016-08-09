import {Pipe, PipeTransform} from '@angular/core';

/*
 * Map out forecast.io icon strings into weather icon classes
 */

@Pipe({name: 'weatherIcon'})
export class WeatherIconPipe {
	transform(value:string): string {
		let icons = {
			// From forecast.io docuemtnation
			'clear-day'          : 'wi-day-sunny',
			'clear-night'        : 'wi-night-clear',
			'rain'               : 'wi-rain',
			'snow'               : 'wi-snow',
			'sleet'              : 'wi-sleet',
			'wind'               : 'wi-cloudy-windy',
			'fog'                : 'wi-fog',
			'cloudy'             : 'wi-cloudy',
			'partly-cloudy-day'  : 'wi-day-cloudy',
			'partly-cloudy-night': 'wi-night-alt-cloudy',
			// Forecast said maybe in future?
			'hail'               : 'wi-hail',
			'thunderstorm'       : 'wi-thunderstorm',
			'tornado'            : 'wi-tornado',
			// Default icon to fall back to
			'default'            : 'wi-train'
		}

		return icons[value] || icons['default'];
	}
}
