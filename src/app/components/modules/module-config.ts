// import moment from 'moment';

import { OptionsConfig } from './module-options';

// import { CountdownComponent } from './countdown/countdown.component';
import { ProgressComponent } from './progress/progress.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SimplifiedScheduleComponent } from './simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './snowday/snowday.component';
// import { StickynotesComponent } from './stickynotes/stickynotes.component';
import { WeatherComponent } from './weather/weather.component';

// We need a static array for the app module component entries
// Not even looping through the config will work because Angular AoT complains
export const moduleComponents: any[] = [
	// CountdownComponent,
	ProgressComponent,
	ScheduleComponent,
	SimplifiedScheduleComponent,
	SnowdayComponent,
	// StickynotesComponent,
	WeatherComponent
];

export const config: Config = {
	// countdown: {
	// 	displayName: 'Countdown',
	// 	icon: 'clock-o',
	// 	component: CountdownComponent,
	// 	defaultHeight: 1,
	// 	defaultWidth: 2,
	// 	options: {
	// 		preset: {
	// 			label: 'Preset dates (Overwrites custom dates)',
	// 			type: 'string',
	// 			default: 'Summer Break',
	// 			select: true,
	// 			selectItems: ['Summer Break', 'Next Break', 'Next Weekend', 'Next Long Weekend', 'Custom Date']
	// 		},
	// 		countdownTo: {
	// 			label: 'Count towards',
	// 			type: 'Date',
	// 			default: moment().year(2018).month('may').date(26).hour(15).minute(15).toDate()
	// 		},
	// 		eventLabel: {
	// 			label: 'Until...',
	// 			type: 'string',
	// 			default: 'Summer Break'
	// 		},
	// 		schoolDays: {
	// 			label: 'Count school days',
	// 			type: 'boolean',
	// 			default: true
	// 		}
	// 	}
	// },
	progress: {
		displayName: 'Progress',
		icon: 'fa-tasks',
		component: ProgressComponent,
		defaultHeight: 3,
		defaultWidth: 4,
		options: {
			showDate: {
				label: 'Show Date',
				type: 'boolean',
				default: true
			}
		}
	},
	schedule: {
		displayName: 'Schedule',
		icon: 'fa-calendar',
		component: ScheduleComponent,
		defaultHeight: 2,
		defaultWidth: 2
	},
	simplifiedSchedule: {
		displayName: 'Simplified Schedule',
		icon: 'fa-calendar',
		component: SimplifiedScheduleComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	snowday: {
		displayName: 'Snowday',
		icon: 'fa-snowflake-o',
		component: SnowdayComponent,
		defaultHeight: 1,
		defaultWidth: 2
	},
	// stickynotes: {
	// 	displayName: 'Sticky Notes',
	// 	icon: 'fa-sticky-note-o',
	// 	component: StickynotesComponent,
	// 	defaultHeight: 2,
	// 	defaultWidth: 2
	// },
	weather: {
		displayName: 'Weather',
		icon: 'fa-cloud',
		component: WeatherComponent,
		defaultHeight: 2,
		defaultWidth: 2,
		options: {
			metric: {
				label: 'Metric Units',
				type: 'boolean',
				default: false
			}
		}
	}
};

export function getDefaultOptions(moduleName: string) {
	const module = config[moduleName];
	if (!module) {
		return {};
	}

	const optionsConfig = module.options;
	if (!optionsConfig) {
		return {};
	}

	const options = {};
	for (const optionKey of Object.keys(optionsConfig)) {
		options[optionKey] = optionsConfig[optionKey].default;
	}
	return options;
}

export interface Config {
	[name: string]: ModuleConfig;
}

export interface ModuleConfig {
	displayName: string;
	icon: string;
	component: any;
	defaultHeight: number;
	defaultWidth: number;
	options?: OptionsConfig;
}
