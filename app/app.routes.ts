import {provideRouter, RouterConfig} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {LoginComponent} from './components/Login/login.component';
import {RegisterComponent} from './components/Register/register.component'
import {SettingsComponent} from './components/Settings/settings.component'
import {AuthGuard} from './common/auth.guard'

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
		canActivate: [AuthGuard]
	}
];

export const appRouterProviders = [
	provideRouter(routes), AuthGuard
];
