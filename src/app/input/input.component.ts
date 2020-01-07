import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
 numberOfScheme = 1;
  constructor() { }

  ngOnInit() {
    this.numberOfScheme = 1;
  }
  addProduct() {
    this.numberOfScheme++;
  }
  subtractProduct() {
    if (this.numberOfScheme > 1) {
      this.numberOfScheme--;
    }
  }
}
