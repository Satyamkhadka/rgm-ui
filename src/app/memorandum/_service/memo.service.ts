import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MemoService {

  constructor(private httpClient: HttpClient) { }


  getMemoById(paymentId) {
    return this.httpClient.get(environment.url + 'payment/' + paymentId);
  }

}
