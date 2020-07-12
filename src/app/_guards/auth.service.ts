
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  sendToken(token: string) {
    localStorage.setItem("LoggedInUser", token)
  }
  getToken() {
    return localStorage.getItem("LoggedInUser")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }

  getDecodedAccessToken(): any {
    try {
      return jwt_decode(this.getToken());
    }
    catch (Error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("LoggedInUser");
    this.myRoute.navigate(["Login"]);
  }
}