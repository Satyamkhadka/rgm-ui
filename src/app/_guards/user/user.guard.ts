import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private auth: AuthService,
    private myRoute: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isLoggedIn()) {

      if (this.auth.getDecodedAccessToken()) {
        if (this.auth.getDecodedAccessToken()['role'] === 'user' || this.auth.getDecodedAccessToken()['role'] === 'admin' || this.auth.getDecodedAccessToken()['role'] === 'superadmin') {
          return true;
        } else {
          this.myRoute.navigate(["menu"]);

        }
      } else {
        this.myRoute.navigate(["menu"]);

      }
    } else {
      this.myRoute.navigate(["login"]);
      return false;
    }
  }

}
