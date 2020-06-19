import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DailyBulletinComponent } from './daily-bulletin/daily-bulletin.component';
import { BulletinArchivesComponent } from './bulletin-archives/bulletin-archives.component';

const dailyBulletinRoutes: Routes = [
	{
		path: '',
		component: DailyBulletinComponent
	},
	{
		path: 'archives',
		component: BulletinArchivesComponent
	},
	{
		path: 'parse',
		children: [
			{
				path: '',
				component: DailyBulletinComponent,
				data: { parse: true }
			},
			{
				path: ':bulletin',
				component: DailyBulletinComponent,
				data: { parse: true }
			}
		]
	},
	{
		path: ':bulletin',
		component: DailyBulletinComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(dailyBulletinRoutes)
	],
	exports: [
		RouterModule
	]
})
export class DailybulletinRoutingModule { }
