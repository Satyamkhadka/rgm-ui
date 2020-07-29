import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }

  createPayment(data) {
    return this.httpClient.post(environment.url + 'payment', data);
  }
  getAllPayment(phase) {
    return this.httpClient.get(environment.url + 'payments/' + phase);
  }
  deletePayment(id) {
    return this.httpClient.post(environment.url + 'payment/delete', { memoId: id });
  }
  updatePayment(data) {
    return this.httpClient.post(environment.url + 'payment/update', data);
  }
  getContractByBatchAndSo(batch, so) {
    return this.httpClient.get(environment.url + 'payment/contract/' + batch + '/' + so);
  }
}
