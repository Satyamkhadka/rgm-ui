import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PmService {

  constructor(private httpClient: HttpClient) { }

  createPm(data){
    return this.httpClient.post(environment.url+'staff',data);
  }
  getAllPm(){
    return this.httpClient.get(environment.url+'staffs');
  }
  deletePm(id){
    return this.httpClient.post(environment.url+'staff/delete',{staffId:id});
  }
  updatePm(data){
    return this.httpClient.post(environment.url+'staff/update',data);
  }
  getPersonsUnderPm(id){
    return this.httpClient.get(environment.url+'staff/persons/'+id);
  }
  addPersonUnderPm(data){
    return this.httpClient.post(environment.url+'staff/addPerson',data);
  }
  removePersonUnderPm(staffAllocateId){
    return this.httpClient.post(environment.url+'staff/removePerson',{staffAllocateId});
  }
  getProjectManagers(){
    return this.httpClient.get(environment.url+'staff/projectmanager');
  }
  getProjectManagerSettings(){
    return this.httpClient.get(environment.url+'staff/projectmanager/settings');
  }
  getSOUnderPM(id){
    return this.httpClient.get(environment.url+'staff/so/'+id);
  }
  addSOUnderPM(data){
    return this.httpClient.post(environment.url+'staff/addSo',data);
  }
  removeSOUnderPM(pmAllocateId){
    return this.httpClient.post(environment.url+'staff/removeSo',{pmAllocateId});
  }
}
