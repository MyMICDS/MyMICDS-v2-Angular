import {Component} from '@angular/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {PortalService} from '../../../../services/portal.service';

@Component({
	selector: 'progress-day',
	templateUrl: 'app/components/Home/components/Progress/progress.html',
	styleUrls: ['dist/app/components/Home/components/Progress/progress.css'],
	directives: [CHART_DIRECTIVES],
	providers: [PortalService]
})
export class ProgressComponent {

	// Progress Bar Config
	progressOptions = {
		legend: {
			display: false,
			fullWidth: false
		},
		cutoutPercentage: 90
	};
	progressClasses = [];
	progressColors = [{
		backgroundColor: [],
		borderColor: ['rgba(0,0,0,0)'],
		borderWidth: [0]
	}];
	progressPercentages = [56];

	constructor(portalService: PortalService) {

		portalService.getSchedule({
			year: 2016,
			month: 5,
			day: 23
		}).subscribe(
			(schedule:any) => {
				console.log(schedule.schedule);

				// Loop through schedule classes
				let scheduleClasses = schedule.schedule.classes;
				for(let i = 0; i < scheduleClasses.length; i++) {
					let scheduleClass = scheduleClasses[i];

					// Add class name to labels
					console.log(scheduleClass);
					this.progressClasses.push(scheduleClass.name);

					// Add color to colors
					var color = '#' + string_to_color(scheduleClass.name, 40);
					console.log('Color', color);
					this.progressColors[0]['backgroundColor'].push(color);
				}

				console.log('Full classes', this.progressClasses);
			},
			(error) => {
				console.error(error);
			}
		);
	}
}

/********************************************************
Name: str_to_color
Description: create a hash from a string then generates a color
Usage: alert('#'+str_to_color("Any string can be converted"));
author: Brandon Corbin [code@icorbin.com]
website: http://icorbin.com
********************************************************/

function string_to_color(str:string, prc?:number) {
    'use strict';

    // Check for optional lightness/darkness
    prc = typeof prc === 'number' ? prc : -10;

    // Generate a Hash for the String
    var hash = function(word) {
        var h = 0;
        for (var i = 0; i < word.length; i++) {
            h = word.charCodeAt(i) + ((h << 5) - h);
        }
        return h;
    };

    // Change the darkness or lightness
    var shade = function(color, prc) {
        var num = parseInt(color, 16),
            amt = Math.round(2.55 * prc),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16)
            .slice(1);
    };

    // Convert init to an RGBA
    var int_to_rgba = function(i) {
        var color = ((i >> 24) & 0xFF).toString(16) +
            ((i >> 16) & 0xFF).toString(16) +
            ((i >> 8) & 0xFF).toString(16) +
            (i & 0xFF).toString(16);
        return color;
    };

    return shade(int_to_rgba(hash(str)), prc);

}
