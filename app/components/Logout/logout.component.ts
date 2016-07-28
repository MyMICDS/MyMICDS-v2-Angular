import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
	selector: 'logout',
	templateUrl: 'app/components/Logout/logout.html',
    styleUrls: ['dist/app/components/Logout/logout.css'],
})
export class LogoutComponent {
    constructor(private router:Router, private authService: AuthService) {
		this.authService.logout().subscribe(
            logoutRes => {},
            error => { console.log('Logout error', error); },
			() => {
				this.router.navigate(['home']);
			}
        )
    }
}
