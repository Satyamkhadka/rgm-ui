import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalBodyService } from '../local-body/_service/local-body.service';
import { SoService } from '../so/_service/so.service';
import { PersonService } from '../person/_service/person.service';
import jwt_decode from 'jwt-decode';
import { RwssStaffService } from './_service/rwss-staff.service';

@Component({
  selector: 'app-rwss-staff',
  templateUrl: './rwss-staff.component.html',
  styleUrls: ['./rwss-staff.component.css']
})
export class RwssStaffComponent implements OnInit {

  allStaff = [];
  allSo = [];

  personUnderStaff = [];
  SOUnderPM = [];

  createLBUnderDistrict = [];
  filterLBUnderDistrict = [];
  updateLBUnderDistrict = [];
  activeLocalBodyFilter = "all";
  activeDistrictFilter = 'all';
  selectedStaff = '';
  setEdit;
  loading = false;

  staffForm: FormGroup;
  updateStaffForm: FormGroup;
  filterForm: FormGroup;

  filter: any = { name: '' };

  formControlNames = {
    rwssStaffId: 'rwssStaffId',
    staffCode: 'staffCode',
    name: 'name',
    nameNP: 'nameNP',
    fullname: 'fullname',
    fullnameNP: 'fullnameNP',
    isPM: 'isPM',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private staffService: RwssStaffService,
    private soService: SoService,
    private formBuilder: FormBuilder,
  ) {
    this.staffForm = this.formBuilder.group({
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.fullname]: '',
      [this.formControlNames.fullnameNP]: '',
      [this.formControlNames.isPM]: false,

    });

    this.updateStaffForm = this.formBuilder.group({
      [this.formControlNames.rwssStaffId]: '',
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.fullname]: '',
      [this.formControlNames.fullnameNP]: '',
      [this.formControlNames.isPM]: false,



    });
    this.filterForm = this.formBuilder.group({
      district: 'all',
      localBody: 'all'
    });
    this.populateList();
    this.getAllSo();

  }

  ngOnInit() {
  }

  populateList() {
    this.allStaff = [];
    this.staffService.getAllStaff().subscribe(data => {
      if (data['success'] === true) {
        this.allStaff = data['data'];
      }
    });
  }


  getAllSo() {
    this.soService.getAllSo().subscribe(data => {
      if (data['success'] === true) {
        this.allSo = data['data'];
      }
    });
  }
  create(data) {
    let plusData = data;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.staffService.createStaff(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }

  getLocalBodyByDistrict(districtId) {
    this.loading = true;
    this.activeLocalBodyFilter = districtId;
    if (districtId.district === 'all' || districtId.district === '') {
      this.activeLocalBodyFilter = 'all';
      this.diffrentialLoding();
      this.loading = false;

      return;
    }

  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  delete(id) {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this.staffService.deleteStaff(id).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.diffrentialLoding();
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });


      }
    })
  }

  diffrentialLoding() {
    if (this.activeLocalBodyFilter === 'all') {
      this.populateList();
    } else {
      //this.getSoBy(this.activeDistrictFilter, this.activeLocalBodyFilter);
    }
  }

  edit(i) {
    this.setEdit = this.allStaff[i];
    this.change1(this.setEdit['districtId'], 'update');
    this.updateStaffForm = this.formBuilder.group({
      [this.formControlNames.rwssStaffId]: this.setEdit['rwssStaffId'],
      [this.formControlNames.staffCode]: this.setEdit['staffCode'],
      [this.formControlNames.name]: this.setEdit['name'],
      [this.formControlNames.nameNP]: this.setEdit['nameNP'],
      [this.formControlNames.fullname]: this.setEdit['fullname'],
      [this.formControlNames.fullnameNP]: this.setEdit['fullnameNP'],
      [this.formControlNames.isPM]: this.setEdit['isPM'],

    });
  }

  doEdit(data) {
    this.staffService.updateStaff(data).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        console.log(data)
        swal.fire('Oops', data['message'], 'error');
      }
    })
  }
  setLocalBodyByDistrict(id, source) {
    console.log(id + '  ' + source)
    this.loading = true;
    this.localService.getLocalBodiesByDistrictId(id).subscribe(data => {
      this.loading = false;
      if (data['success'] === true) {
        if (source === 'create') {
          this.createLBUnderDistrict = data['data'];
        } else if (source === 'update') {
          console.log(data)
          this.updateLBUnderDistrict = data['data'];
        } else if (source === 'filter') { this.filterLBUnderDistrict = data['data']; }
      }
    })
  }
  change1(event, source) {
    this.setLocalBodyByDistrict(event, source);
  }



  //pm part
  getSOUnderPM(rwssStaffId) {
    this.selectedStaff = rwssStaffId;

    this.staffService.getSOUnderPM(rwssStaffId).subscribe(data => {
      if (data['success'] === true) {
        console.log(data)
        this.selectedStaff = rwssStaffId;
        this.SOUnderPM = data['data'];
      }
    });
  }
  addSOUnderPM(soId) {
    console.log(soId)
    if (this.SOUnderPM.some(e => e == soId)) {
      swal.fire('Success', 'Already assigned', 'success');
      return;
    };
    this.staffService.addSOUnderPM({ rwssStaffId: this.selectedStaff, so: soId }).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.getSOUnderPM(this.selectedStaff);
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }
  removeSOUnderPM(soId) {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this.staffService.removeSOUnderPM({ soId: soId, rwssStaffId: this.selectedStaff }).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.getSOUnderPM(this.selectedStaff);
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });


      }
    })

  }

}
