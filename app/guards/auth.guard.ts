import { Injectable } from'@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService} from '../services/auth.service'
import {Router} from '@angular/router'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private router: Router) {}

    canActivate() {
        if (localStorage['user']) {return true}
        console.info("auth.guard.ts triggered.");
        this.router.navigate(['/login']);
        return false;
    }
}