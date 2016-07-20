import {provideRouter, RouterConfig} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {LoginComponent} from './components/Login/login.component';
import {RegisterComponent} from './components/Register/register.component'
import {SettingsComponent} from './components/Settings/settings.component'
import {PlannerComponent} from './components/Planner/planner.component'

import {AuthGuard} from './common/auth.guard'
import {CanDeactivateGuard} from './common/canDeactivate.guard'

const routes: RouterConfig = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'lunch',
		component: LunchComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'planner',
		component: PlannerComponent,
	}
];

export const appRouterProviders = [
	provideRouter(routes), AuthGuard, CanDeactivateGuard
];
