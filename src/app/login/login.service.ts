import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  getSignInCredentials(userInfo){
    return this.httpClient.post(environment.url+'login',userInfo);
  }
}
