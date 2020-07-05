import { data } from './../../environments/data';
import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  active = false;
  listItems = data.listItems;

  userInfo: User;
  constructor() { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userInfo = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser'));
    console.log(this.userInfo)

  }
  toggleClass(event: any) {
    this.active = !this.active;
  }

  getDecodedAccessToken(token: string): User {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  logout(event: any) {
    this.toggleClass(event);
    localStorage.clear();
    this.getUserInfo();
  }
}

class User {
  success: boolean;
  userId: number;
  userName: string;
  authenticated: boolean;
  role: string;
  rolePriority: string;
  active: string;
  iat: any;
  exp: any;
}
