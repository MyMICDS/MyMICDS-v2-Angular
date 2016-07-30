import {Component} from '@angular/core';
import {NgFor} from '@angular/common';
import {NotificationService} from '../../services/notification.service';
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

    notifications = [];
    
    ngOnInit() {
        this.clickToggle$ = Observable.fromEvent(document, 'click')
            .map((event: MouseEvent) => event.target.className)
            .filter((className: string) => className !== 'sidebar' && className !== 'sidebar-toggle');
        this.notifications = this.noteService.getNotifications();
    }

    clickToggle$;
    open: boolean = false;

    openSidebar() {
        this.open = true;
        this.clickToggle$.subscribe(
            className => {this.open = false}
        )
    }
}