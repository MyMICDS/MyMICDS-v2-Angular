import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LunchComponent } from './lunch/lunch.component';

const lunchRoutes: Routes = [
	{
		path: '',
		component: LunchComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(lunchRoutes)
	],
	exports: [
		RouterModule
	]
})
export class LunchRoutingModule { }
