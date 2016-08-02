import {Component} from '@angular/core';
import {NgFor} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'
import {contains} from '../../common/utils';
import {DatePipe} from '@angular/common'

import {AlertService} from '../../services/alert.service';
import {NotificationService, Event, Announcement} from '../../services/notification.service';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'sidebar',
    templateUrl: 'app/components/SideBar/sidebar.html',
    styleUrls: ['dist/app/components/SideBar/sidebar.css'],
    providers: [NotificationService],
    directives: [NgFor]
})
export class SidebarComponent {
    constructor(private alertService: AlertService, private notificationService: NotificationService, private userService: UserService) {}

	announcements:Announcement[] = [];
    notifications:Event[] = [];

	open = false;
	clickToggle$;

    ngOnInit() {
		// Click event for dismissing the sidebar
        this.clickToggle$ = Observable.fromEvent(document, 'click')
            .map((event:any) => event.target.className.split(' '))
            .filter((className:string[]) => !contains(className, 'sidebar') && !contains(className, 'sidebar-toggle') && !contains(className, 'sidebar-icon'));

		// Get events
        if (typeof this.userService.getUsername() === 'string') {
            this.notificationService.getEvents().subscribe(
                events => {
                    this.announcements = events.announcements,
                    this.notifications = events.notifications
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
        )
    }
}
