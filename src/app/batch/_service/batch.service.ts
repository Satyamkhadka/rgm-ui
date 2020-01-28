import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(private httpClient: HttpClient) { }

  createBatch(data){
    return this.httpClient.post(environment.url+'batch',data);
  }
  getAllBatch(){
    return this.httpClient.get(environment.url+'batchs');
  }
  deleteBatch(id){
    return this.httpClient.post(environment.url+'batch/delete',{batchId:id});
  }
  updateBatch(data){
    return this.httpClient.post(environment.url+'batch/update',data);
  }
}
