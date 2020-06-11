import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../common/auth.guard';

import { AboutComponent } from './about/about.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';

const aboutRoutes: Routes = [
	{
		path: '',
		component: AboutComponent
	},
	{
		path: 'suggestions',
		component: SuggestionsComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(aboutRoutes)
	],
	exports: [
		RouterModule
	]
})
export class AboutRoutingModule { }
