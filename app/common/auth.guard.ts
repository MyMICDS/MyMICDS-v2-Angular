import {Injectable} from'@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard {

	constructor(private router: Router) {}

    canActivate() {
        if(localStorage['user']) return true;
        console.info('auth.guard.ts triggered.');
        this.router.navigate(['/login']);
        return false;
    }
}
