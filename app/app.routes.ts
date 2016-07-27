import {provideRouter, RouterConfig} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {PlannerComponent} from './components/Planner/planner.component';
import {BulletinComponent} from './components/Bulletin/bulletin.component';
import {BulletinArchivesComponent} from './components/BulletinArchives/bulletin-archives.component';
import {SettingsComponent} from './components/Settings/settings.component';
import {AboutComponent} from './components/About/about.component';
import {LoginComponent} from './components/Login/login.component';
import {RegisterComponent} from './components/Register/register.component';

import {AuthGuard} from './common/auth.guard';
import {CanDeactivateGuard} from './common/canDeactivate.guard';

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
		path: 'planner',
		component: PlannerComponent,
	},
	{
		path: 'daily-bulletin',
		component: BulletinComponent
	},
	{
		path: 'daily-bulletin/:bulletin',
		component: BulletinComponent
	},
	{
		path: 'bulletin-archives',
		component: BulletinArchivesComponent
	},
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'about',
		component: AboutComponent
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
	provideRouter(routes), AuthGuard, CanDeactivateGuard
];
