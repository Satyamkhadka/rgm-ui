import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  constructor(private httpClient: HttpClient) { }
  createScheme(data){
    return this.httpClient.post(environment.url+'scheme',data);
  }
  getAllScheme(){
    return this.httpClient.get(environment.url+'schemes');
  }
  getSchemeByDistrictId(districtId){
    return this.httpClient.get(environment.url+'schemes/districtId/'+districtId);
  }
  getSchemeByLocalBodyId(localBodyId){
    return this.httpClient.get(environment.url+'schemes/localBodyId/'+localBodyId);
  }
  getSchemeBySoId(localBodyId){
    return this.httpClient.get(environment.url+'schemes/localBodyId/'+localBodyId);
  }
  deleteScheme(id){
    return this.httpClient.post(environment.url+'scheme/delete',{schemeId:id})
  }
  updateScheme(data){
    return this.httpClient.post(environment.url+'scheme/update',data);
  }
}
