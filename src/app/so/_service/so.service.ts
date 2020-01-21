import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoService {

  constructor(private httpClient: HttpClient) { }

  createSo(data){
    return this.httpClient.post(environment.url+'so',data);
  }
  getAllSo(){
    return this.httpClient.get(environment.url+'so');
  }
  getSoByDistrictId(districtId){
    return this.httpClient.get(environment.url+'so/districtId/'+districtId);
  }
  getSoByLocalBodyId(localBodyId){
    return this.httpClient.get(environment.url+'so/localBodyId/'+localBodyId);
  }
  deleteSo(id){
    return this.httpClient.post(environment.url+'so/delete',{soId:id})
  }
  updateSo(data){
    return this.httpClient.post(environment.url+'so/update',data);
  }
}
