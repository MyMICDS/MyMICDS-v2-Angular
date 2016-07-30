import {Component} from '@angular/core';
import {NgFor} from '@angular/common';
import {NotificationService, noty} from '../../services/notification.service';
import {Observable} from 'rxjs/Observable';
import '../../common/rxjs-operators'

@Component({
    selector: 'sidebar',
    templateUrl: 'app/components/SideBar/sidebar.html',
    styleUrls: ['dist/app/components/SideBar/sidebar.css'],
    providers: [NotificationService],
    directives: [NgFor]
})
export class SidebarComponent {
    constructor(private noteService: NotificationService) {}

	announcements:noty[] = [];
    notifications:noty[] = [];

	open: boolean = false;
	clickToggle$;

    ngOnInit() {
        this.clickToggle$ = Observable.fromEvent(document, 'click')
            .map((event: MouseEvent) => event.target.className)
            .filter((className: string) => className !== 'sidebar' && className !== 'sidebar-toggle');
        this.notifications = this.noteService.getNotifications();
    }

    openSidebar() {
        this.open = !this.open;
        this.clickToggle$.subscribe(
            className => {
				this.open = false;
				this.clickToggle$.unsubscribe();
			}
        )
    }
}
