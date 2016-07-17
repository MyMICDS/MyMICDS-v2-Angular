import {provideRouter, RouterConfig} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {LoginComponent} from './components/Login/login.component';
import {RegisterComponent} from './components/Register/register.component'

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
	}
];

export const appRouterProviders = [
	provideRouter(routes)
];
