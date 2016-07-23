import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {HomeComponent} from './components/Home/home.component';
import {LoginComponent} from './components/Login/login.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {NavbarComponent} from './components/Navbar/navbar.component';
import {PlannerComponent} from './components/Planner/planner.component';
import {RegisterComponent} from './components/Register/register.component';
import {SettingsComponent} from './components/Settings/settings.component';

import {AuthService} from './services/auth.service';
import {CanvasService} from './services/canvas.service';
import {LocalStorageService} from './services/localStorage.service';
import {PortalService} from './services/portal.service';
import {UserService} from './services/user.service';


@Component({
	selector: 'mymicds-app',
	template: `
		<navbar></navbar>
		<router-outlet></router-outlet>
	`,
	providers: [HTTP_PROVIDERS, AuthService, CanvasService, LocalStorageService, PortalService, UserService],
	directives: [NavbarComponent, ROUTER_DIRECTIVES],
	precompile: [HomeComponent, LoginComponent, LunchComponent, NavbarComponent, PlannerComponent, RegisterComponent, SettingsComponent]
})
export class AppComponent {}
