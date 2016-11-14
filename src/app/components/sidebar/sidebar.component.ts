import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../../common/rxjs-operators';
import { contains } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { NotificationService, Event, Announcement } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { trigger, state, style, transition, animate } from '@angular/core';

@Component({
	selector: 'mymicds-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	animations: [
		trigger('tabOpen', [
			state('active', style({
				left: '0'
			})),
			state('inactive', style({
				left: '-600px'
			})),
			transition('inactive => active', animate('200ms ease-in')),
			transition('active => inactive', animate('200ms ease-out'))
		])
	]
})
export class SidebarComponent implements OnInit {

	sidebarTabs: Array<String> = ['active', 'inactive']; // Representation of the open state of the sidebar tabs
	announcements: Announcement[] = [];
	notifications: Event[] = [];

	open = false;
	clickToggle$;

	constructor(
		private alertService: AlertService,
		private notificationService: NotificationService,
		private userService: UserService,
		private authService: AuthService
	) { }

	ngOnInit() {
		// Click event for dismissing the sidebar
		this.clickToggle$ = Observable.fromEvent(document, 'click')
			.filter((event: any) => {
				let el: Element = event.target;
				while (el && el.parentNode) {
					let classList = el.className.split(' ');
					if (contains(classList, 'sidebar') || contains(classList, 'sidebar-toggle')) {
						return false;
					};
					el = el.parentElement;
				}
				return true;
			});

		// Get events
		if (typeof this.userService.getUsername() === 'string') {
			this.notificationService.getEvents().subscribe(
				events => {
					this.announcements = events.announcements;
					this.notifications = events.notifications;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Notifications Error!', error);
				}
			);
		}

		this.authService.loginEmitter.subscribe(() => {
			this.notificationService.getEvents().subscribe(
				events => {
					this.announcements = events.announcements;
					this.notifications = events.notifications;
				},
				error => {
					this.alertService.addAlert('danger', 'Get Notifications Error!', error);
				}
			);
		});
	}

	openSidebar() {
		this.open = true;
		let subscription = this.clickToggle$.subscribe(
			className => {
				this.open = false;
				subscription.unsubscribe();
			}
		);
	}

	openTab(n: number) {
		this.sidebarTabs.forEach((v, i:number) => this.sidebarTabs[i] = 'inactive');
		this.sidebarTabs[n] = 'active';
	}
}
