import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoService {

  constructor(private httpClient: HttpClient) { }

  createSo(data) {
    return this.httpClient.post(environment.url + 'so', data);
  }
  getAllSo() {
    return this.httpClient.get(environment.url + 'so');
  }
  getSoByDistrictId(districtId) {
    return this.httpClient.get(environment.url + 'so/districtId/' + districtId);
  }
  getSoByLocalBodyId(localBodyId) {
    return this.httpClient.get(environment.url + 'so/localBodyId/' + localBodyId);
  }
  deleteSo(id) {
    return this.httpClient.post(environment.url + 'so/delete', { soId: id })
  }
  updateSo(data) {
    return this.httpClient.post(environment.url + 'so/update', data);
  }
  assignStaffUnderSo(data) {
    return this.httpClient.post(environment.url + 'so/addStaff', data);
  }
  getStaffUnderSo(soId) {
    return this.httpClient.get(environment.url + 'so/staffs/' + soId);
  }

  getPersonUnderSoandStaff(filter) {
    return this.httpClient.post(environment.url + 'so/staffs/add/person', filter);

  }
  removePersonUnderSoandStaff(staffAllocateId, soId) {
    return this.httpClient.post(environment.url + 'so/staffs/remove/person', { staffAllocateId, soId });

  }
}
