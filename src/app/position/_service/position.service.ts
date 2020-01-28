import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private httpClient: HttpClient) { }

  createPosition(data){
    return this.httpClient.post(environment.url+'position',data);
  }
  getAllPosition(){
    return this.httpClient.get(environment.url+'positions');
  }
  deletePosition(id){
    return this.httpClient.post(environment.url+'position/delete',{positionId:id});
  }
  updatePosition(data){
    return this.httpClient.post(environment.url+'position/update',data);
  }
}
