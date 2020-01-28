import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) { }

  createPerson(data){
    return this.httpClient.post(environment.url+'person',data);
  }
  getAllPerson(){
    return this.httpClient.get(environment.url+'persons');
  }
  deletePerson(id){
    return this.httpClient.post(environment.url+'person/delete',{personId:id});
  }
  updatePerson(data){
    return this.httpClient.post(environment.url+'person/update',data);
  }
}
