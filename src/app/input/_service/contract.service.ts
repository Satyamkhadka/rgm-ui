import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private httpClient: HttpClient) { }

  createContract(data){
    return this.httpClient.post(environment.url+'contract',data);
  }
  getAllContract(){
    return this.httpClient.get(environment.url+'contracts');
  }
  deleteContract(id){
    return this.httpClient.post(environment.url+'contract/delete',{contractId:id});
  }
  updateContract(data){
    return this.httpClient.post(environment.url+'contract/update',data);
  }
  
}
