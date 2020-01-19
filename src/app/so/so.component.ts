import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SoService } from './_service/so.service';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-so',
  templateUrl: './so.component.html',
  styleUrls: ['./so.component.css']
})
export class SoComponent implements OnInit {
  allDistricts = [];
  allLocalBodies = [];
  allSO = [];
  createLBUnderDistrict=[];
  filterLBUnderDistrict=[];
  updateLBUnderDistrict=[];
  activeContent = "all";
  setEdit;
  loading = false;

  soForm: FormGroup;
  updateSoForm: FormGroup;
  filterForm: FormGroup;

  formControlNames = {
    soId:'soId',
    soCode: 'soCode',
    name: 'name',
    nameNP: 'nameNP',
    street: 'street',
    ward: 'ward',
    vdcId: 'vdcId',
    districtId: 'districtId',
    localBodyId:'localBodyId',
    address: 'address',
    poBox: 'poBox',
    phone1: 'phone1',
    phone2: 'phone2',
    mobile: 'mobile',
    email: 'email',
    fax: 'fax',
    contactPerson: 'contactPerson',
    cDesignation: 'cDesignation',
    cPhone: 'cPhone',
    cMobile: 'cMobile',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private formBuilder: FormBuilder
  ) {
    this.soForm = this.formBuilder.group({
      [this.formControlNames.soCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.street]: '',
      [this.formControlNames.ward]: '',
     // [this.formControlNames.vdcId]:'',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.address]: '',
      [this.formControlNames.poBox]: '',
      [this.formControlNames.phone1]: '',
      [this.formControlNames.phone2]: '',
      [this.formControlNames.mobile]: '',
      [this.formControlNames.email]: '',
      [this.formControlNames.fax]: '',
      [this.formControlNames.contactPerson]: '',
      [this.formControlNames.cDesignation]: '',
      [this.formControlNames.cPhone]: '',
      [this.formControlNames.cMobile]: '',
      [this.formControlNames.active]: '',
      [this.formControlNames.createdBy]: '',
      [this.formControlNames.createdOn]: ''

    });
    console.log(this.soForm.controls)

    this.updateSoForm = this.formBuilder.group({
      [this.formControlNames.soCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.street]: '',
      [this.formControlNames.ward]: '',
      //[this.formControlNames.vdcId]:'',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.address]: '',
      [this.formControlNames.poBox]: '',
      [this.formControlNames.phone1]: '',
      [this.formControlNames.phone2]: '',
      [this.formControlNames.mobile]: '',
      [this.formControlNames.email]: '',
      [this.formControlNames.fax]: '',
      [this.formControlNames.contactPerson]: '',
      [this.formControlNames.cDesignation]: '',
      [this.formControlNames.cPhone]: '',
      [this.formControlNames.cMobile]: '',
      [this.formControlNames.active]: '',
      [this.formControlNames.createdBy]: '',
      [this.formControlNames.createdOn]: ''
    });
    this.filterForm = this.formBuilder.group({
      district: 'all',
      localBody: 'all'
    });
    this.getDistricts();
    //this.getLocalBodies();
    //this.getSchemes();
    //this.populateList();

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

  edit(i) {
    this.setEdit = this.allLocalBodies[i];
    this.updateSoForm = this.formBuilder.group({
      [this.formControlNames.soCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.street]: '',
      [this.formControlNames.ward]: '',
      //[this.formControlNames.vdcId]:'',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.address]: '',
      [this.formControlNames.poBox]: '',
      [this.formControlNames.phone1]: '',
      [this.formControlNames.phone2]: '',
      [this.formControlNames.mobile]: '',
      [this.formControlNames.email]: '',
      [this.formControlNames.fax]: '',
      [this.formControlNames.contactPerson]: '',
      [this.formControlNames.cDesignation]: '',
      [this.formControlNames.cPhone]: '',
      [this.formControlNames.cMobile]: '',
      [this.formControlNames.active]: '',
      [this.formControlNames.createdBy]: '',
      [this.formControlNames.createdOn]: ''
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
  setLocalBodyByDistrict(id,source){
    this.loading = true;
    this.localService.getLocalBodiesByDistrictId(id).subscribe(data => {
      this.loading=false;
      if (data['success'] === true) {
        if(source==='create'){ this.createLBUnderDistrict= data['data'] ;
        } else if(source==='update'){this.updateLBUnderDistrict= data['data'] ;
        } else if (source==='filter'){this.filterLBUnderDistrict= data['data'] ;}
        console.log('set')
      }
    })
  }
  change1(event,source){   
    this.setLocalBodyByDistrict(event,source)
  }
}
