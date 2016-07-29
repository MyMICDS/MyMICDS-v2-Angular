import {Injectable} from'@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {JwtHelper} from 'angular2-jwt';
import {LocalStorage, SessionStorage} from 'h5webstorage';

@Injectable()
export class AuthGuard {

	constructor(private router: Router, private localStorage: LocalStorage, private sessionStorage: SessionStorage) {}

	jwtHelper = new JwtHelper();
    canActivate() {
		// Look in session storage for id_token, but fallback to local storage
		let session = sessionStorage.getItem('id_token');
		let local = localStorage.getItem('id_token');

		let token = session || local;

		// If there is a token, then user is logged in, otherwise redirect to login page
        if(token && !this.jwtHelper.isTokenExpired(token)) return true;

		// Delete JWT from the client just in case it was simply expired
		this.sessionStorage.removeItem('id_token');
		this.localStorage.removeItem('id_token');

        console.info('auth.guard.ts triggered.');

        this.router.navigate(['/login']);
        return false;
    }
}
