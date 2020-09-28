import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor(
    private htppClient: HttpClient
  ) { }

  getAllData() {
    return this.htppClient.get(environment.url + 'misc/');
  }
  update(data) {
    return this.htppClient.post(environment.url + 'misc/update', data)
  }
}
