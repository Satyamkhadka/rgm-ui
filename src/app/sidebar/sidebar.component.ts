import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  active = true;

  listItems =
    [
      {
        name:'Home',
        icon:'home',
        urlTo:'/home'
      },
      {
        name:'Local Body',
        icon:'map-marker',
        urlTo:'/local-body'
      },
      {
        name:'SO',
        icon:'building',
        urlTo:'/so'
      },
      {
        name:'Scheme',
        icon:'briefcase',
        urlTo:'/scheme'
      },
      {
        name:'Staffs',
        icon:'users',
        urlTo:'/staff'
      },
      {
        name:'Person',
        icon:'user',
        urlTo:'/person'
      },
      {
        name:'Batch',
        icon:'calendar',
        urlTo:'/batch'
      },
      {
        name:'Assign',
        icon:'download',
        urlTo:'/'
      },
      {
        name:'Contracts',
        icon:'eye',
        urlTo:'/contract'
      },

    ];
  constructor() { }

  ngOnInit() {
  }

  toggleClass(event: any) {
    this.active = !this.active;
  }
}
