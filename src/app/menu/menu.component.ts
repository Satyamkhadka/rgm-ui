import { data } from './../../environments/data';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_guards/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  listItems = data.listItems;
  userAccess = 0;
  constructor(private authService: AuthService) {

    this.userAccess = this.authService.getDecodedAccessToken()['rolePriority'];
    console.log(this.userAccess)

  }

  ngOnInit() {

  }

}
