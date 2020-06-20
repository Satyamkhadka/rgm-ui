import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LocalBodyService } from './_service/local-body.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-local-body',
  templateUrl: './local-body.component.html',
  styleUrls: ['./local-body.component.css']
})
export class LocalBodyComponent implements OnInit {
  allDistricts = [];
  allLocalBodies = [];
  activeContent = "all";
  setEdit;
  loading = false;
  localBodyForm: FormGroup;
  updateLocalBodyForm: FormGroup;
  districtForm: FormGroup;

  filter: any = { name: '' };

  formControlNames = {
    selfid: 'localBodyId',
    code: 'localBodyCode',
    name: 'name',
    nameNP: 'nameNP',
    id: 'districtId',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private formBuilder: FormBuilder
  ) {
    this.localBodyForm = this.formBuilder.group({
      [this.formControlNames.code]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.id]: '',

    });
    this.updateLocalBodyForm = this.formBuilder.group({
      [this.formControlNames.name]: '',
      [this.formControlNames.selfid]: '',
      [this.formControlNames.code]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.id]: '',
    });
    this.districtForm = this.formBuilder.group({
      district: 'all'
    });
    this.getDistricts();
    this.populateList();
  }

  ngOnInit() {
  }
  populateList() {
    this.allLocalBodies = [];
    this.localService.getAllLocalBodies().subscribe(data => {
      if (data['success'] === true) {
        this.allLocalBodies = data['data'];
      }
    })
  }
  getDistricts() {
    this.localService.getAllDistricts().subscribe(data => {
      if (data['success'] === true) {
        this.allDistricts = data['data'];
        console.log(this.allDistricts)
      }
    });
  }

  create(data) {
    console.log(data);
    let plusData = data;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.localService.createLocalBody(plusData).subscribe(data => {
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
    this.activeContent = districtId;
    if (districtId.district === 'all' || districtId.district === '') {
      this.activeContent = 'all';
      this.diffrentialLoding();
      this.loading = false;

      return;
    }

    this.localService.getLocalBodiesByDistrictId(districtId.district).subscribe(data => {
      if (data['success'] === true) {
        this.allLocalBodies = [];
        this.allLocalBodies = data['data'];
        this.loading = false;
      }
    })
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

        this.localService.deleteLocal(id).subscribe(data => {
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
    if (this.activeContent === 'all') {
      this.populateList();
    } else {
      this.getLocalBodyByDistrict(this.activeContent);
    }
  }

  edit(data) {
    this.setEdit = data;
    this.updateLocalBodyForm = this.formBuilder.group({
      [this.formControlNames.name]: this.setEdit[this.formControlNames.name],
      [this.formControlNames.selfid]: this.setEdit[this.formControlNames.selfid],
      [this.formControlNames.code]: this.setEdit[this.formControlNames.code],
      [this.formControlNames.nameNP]: this.setEdit[this.formControlNames.nameNP],
      [this.formControlNames.id]: this.setEdit[this.formControlNames.id],
    });
  }

  doEdit(data) {
    console.log(data);
    this.localService.updateLocal(data).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        console.log(data)
        swal.fire('Oops', data['message'], 'error');
      }
    })
  }
}
