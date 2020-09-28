import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private httpClient: HttpClient) { }

  getAllUsers() {
    return this.httpClient.get(environment.url + 'users');
  }


  createUser(data) {
    return this.httpClient.post(environment.url + 'register', data);
  }
  editUser(data) {
    return this.httpClient.post(environment.url + 'update', data);
  }
  deleteUser(data) {
    return this.httpClient.post(environment.url + 'delete/user', data);
  }
}
