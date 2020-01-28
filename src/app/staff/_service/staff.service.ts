import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private httpClient: HttpClient) { }

  createStaff(data){
    return this.httpClient.post(environment.url+'staff',data);
  }
  getAllStaff(){
    return this.httpClient.get(environment.url+'staffs');
  }
  deleteStaff(id){
    return this.httpClient.post(environment.url+'staff/delete',{staffId:id});
  }
  updateStaff(data){
    return this.httpClient.post(environment.url+'staff/update',data);
  }
}
