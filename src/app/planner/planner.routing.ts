import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { months } from '../common/utils';
import * as moment from 'moment';

import { PlannerComponent } from './planner/planner.component';

export function plannerTitle(url: string) {
	const parts = url.split('/');
	const date = moment();
	// Use moment.js's .year and .month methods to take advantage of overflowing (Ex. month of -1 is December of previous year)
	// (This is same strategy used to determine date of planner component, so title will always be synced)
	date.year(Number(parts[2]));
	date.month(Number(parts[3]) - 1);
	return `MyMICDS - Planner - ${months[date.month()]} ${date.year()}`;
}

const plannerRoutes: Routes = [
	{
		path: '',
		component: PlannerComponent
	},
	{
		path: ':year/:month',
		component: PlannerComponent,
		data: {
			title: plannerTitle
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(plannerRoutes)],
	exports: [RouterModule]
})
export class PlannerRoutingModule {}
