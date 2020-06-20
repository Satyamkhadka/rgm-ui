import { data } from './../../environments/data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  listItems = data.listItems;
  constructor() { }

  ngOnInit() {
  }

}
