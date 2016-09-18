import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../../common/rxjs-operators';
import { contains } from '../../common/utils';

import { AlertService } from '../../services/alert.service';
import { NotificationService, Event, Announcement } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mymicds-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	announcements: Announcement[] = [];
	notifications: Event[] = [];

	open = false;
	clickToggle$;

	constructor(
		private alertService: AlertService,
		private notificationService: NotificationService,
		private userService: UserService
	) { }

	ngOnInit() {
		// Click event for dismissing the sidebar
		this.clickToggle$ = Observable.fromEvent(document, 'click')
			.map((event: any) => event.target.className.split(' '))
			.filter((className: string[]) => !contains(className, 'sidebar')
				&& !contains(className, 'sidebar-toggle')
				&& !contains(className, 'sidebar-icon')
			);

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

}
