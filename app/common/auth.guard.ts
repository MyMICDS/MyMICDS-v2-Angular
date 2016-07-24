import {Injectable} from'@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {LocalStorage, SessionStorage} from 'h5webstorage';

@Injectable()
export class AuthGuard {

	constructor(private router: Router, private localStorage: LocalStorage, private sessionStorage: SessionStorage) {}

    canActivate() {
        // Get JWT
		let token = sessionStorage['id_token'] || localStorage['id_token'];
		// If there is a token, then user is logged in, otherwise redirect to login page
        if(token) return true;
        console.info('auth.guard.ts triggered.');
        this.router.navigate(['/login']);
        return false;
    }
}
