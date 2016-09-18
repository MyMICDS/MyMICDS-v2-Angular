import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

import {AuthGuard} from './common/auth.guard';
import {CanDeactivateGuard} from './common/canDeactivate.guard';

const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent,
		data: {
			title: 'MyMICDS - Home'
		}
	},
	{
		path: 'about',
		component: AboutComponent
	}
	// { path: '**', component: PageNotFoundComponent } // 404
];

export const appRoutingProviders: any[] = [
	AuthGuard,
	CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
