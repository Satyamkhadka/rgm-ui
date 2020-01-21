import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalBodyService {

  constructor(private httpClient: HttpClient) { }

  getAllDistricts(){
    return this.httpClient.get(environment.url+'districts');
  }
  createLocalBody(data){
    console.log(data)
    return this.httpClient.post(environment.url+'local-body',data);
  }
  getAllLocalBodies(){
    return this.httpClient.get(environment.url+'local-bodies');
  }
  getLocalBodiesByDistrictId(districtId){
    return this.httpClient.get(environment.url+'local-bodies/districtId/'+districtId);
  }
  deleteLocal(id){
    return this.httpClient.post(environment.url+'local-body/delete',{localBodyId:id})
  }
  updateLocal(data){
    return this.httpClient.post(environment.url+'local-body/update',data);
  }
}
