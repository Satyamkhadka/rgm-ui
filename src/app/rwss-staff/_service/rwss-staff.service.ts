import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RwssStaffService {


  constructor(private httpClient: HttpClient) { }

  createStaff(data) {
    return this.httpClient.post(environment.url + 'rwss-staff', data);
  }

  getAllStaff() {
    return this.httpClient.get(environment.url + 'rwss-staffs');
  }

  deleteStaff(id) {
    return this.httpClient.post(environment.url + 'rwss-staff/delete', { rwssStaffId: id });
  }

  updateStaff(data) {
    return this.httpClient.post(environment.url + 'rwss-staff/update', data);
  }
  getPersonsUnderStaff(id) {
    return this.httpClient.get(environment.url + 'rwss-staff/persons/' + id);
  }
  addPersonUnderStaff(data) {
    return this.httpClient.post(environment.url + 'rwss-staff/addPerson', data);
  }
  removePersonUnderStaff(staffAllocateId) {
    return this.httpClient.post(environment.url + 'rwss-staff/removePerson', { staffAllocateId });
  }
  getProjectManagers() {
    return this.httpClient.get(environment.url + 'rwss-staff/projectmanager');
  }

  getSOUnderPM(id) {
    return this.httpClient.get(environment.url + 'rwss-staff/so/' + id);
  }

  addSOUnderPM(data) {
    return this.httpClient.post(environment.url + 'rwss-staff/addSo', data);
  }
  removeSOUnderPM(data) {
    return this.httpClient.post(environment.url + 'rwss-staff/removeSo', data);
  }

}
