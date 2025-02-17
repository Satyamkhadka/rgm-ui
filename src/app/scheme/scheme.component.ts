import { SchemeService } from './_service/scheme.service';
import { Component, OnInit } from '@angular/core';
import { SoService } from './../so/_service/so.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit {
  allSO = [];
  allScheme = [];
  allDistricts = [];
  localbodies = [];
  activeFilter = "all";
  setEdit;
  loading = false;
  filter: any = { name: '' };
  schemeForm: FormGroup;
  updateSchemeForm: FormGroup;
  filterForm: FormGroup;

  formControlNames = {
    schemeId: 'schemeId',
    schemeCode: 'schemeCode',
    name: 'name',
    nameNP: 'nameNP',
    districtId: 'districtId',
    localBodyId: 'localBodyId',
    wardNo: 'wardNo',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn',
  }
  constructor(
    private localService: LocalBodyService,
    private soService: SoService,
    private formBuilder: FormBuilder,
    private schemeService: SchemeService
  ) {

    this.schemeForm = this.formBuilder.group({
      [this.formControlNames.schemeCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.wardNo]: '',
      [this.formControlNames.active]: '',
      [this.formControlNames.createdBy]: '',
      [this.formControlNames.createdOn]: '',

    });

    this.updateSchemeForm = this.formBuilder.group({
      [this.formControlNames.schemeId]: '',
      [this.formControlNames.schemeCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.wardNo]: '',
    });
    this.filterForm = this.formBuilder.group({
      so: 'all'
    });
    this.getAllSo();
    this.populateList();
    this.getDistricts();

  }

  ngOnInit() {
  }

  populateList() {
    this.allScheme = [];
    this.schemeService.getAllScheme().subscribe(data => {
      if (data['success'] === true) {
        this.allScheme = data['data'];
      }
    });
  }

  getAllSo() {
    this.soService.getAllSo().subscribe(data => {
      if (data['success'] === true) {
        this.allSO = data['data'];
      }
    });
  }
  create(data) {
    let plusData = data;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;

    this.schemeService.createScheme(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
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

        this.soService.deleteSo(id).subscribe(data => {
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
    if (this.activeFilter === 'all') {
      this.populateList();
    } else {
      this.getSchemeBySo(this.activeFilter);
    }
  }

  edit(data) {
    this.setEdit = data;
    this.getLocalBodyByDistrict(this.setEdit['districtId']);
    this.updateSchemeForm = this.formBuilder.group({
      [this.formControlNames.schemeId]: this.setEdit['schemeId'],
      [this.formControlNames.schemeCode]: this.setEdit['schemeCode'],
      [this.formControlNames.name]: this.setEdit['name'],
      [this.formControlNames.nameNP]: this.setEdit['nameNP'],
      [this.formControlNames.districtId]: this.setEdit['districtId'],
      [this.formControlNames.localBodyId]: this.setEdit['localBodyId'],
      [this.formControlNames.wardNo]: this.setEdit['wardNo'],
    });
  }

  doEdit(data) {
    console.log(data)
    this.schemeService.updateScheme(data).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        console.log(data)
        swal.fire('Oops', data['message'], 'error');
      }
    })
  }

  getSchemeBySo(id) {
    if (id === 'all') { this.activeFilter = 'all'; this.populateList(); }
    else {
      this.schemeService.getSchemeBySoId(id).subscribe(data => {
        if (data['success'] === true) {
          this.allScheme = [];
          this.activeFilter = id;
          this.allScheme = data['data'];
        }
      });
    }
  }





  //later update

  getDistricts() {
    this.localService.getAllDistricts().subscribe(data => {
      if (data['success'] === true) {
        this.allDistricts = data['data'];
        console.log(this.allDistricts)
      }
    });
  }

  getLocalBodyByDistrict(districtId) {
    console.log(districtId)
    this.localService.getLocalBodiesByDistrictId(districtId).subscribe(data => {
      if (data['success'] === true) {
        this.localbodies = [];
        this.localbodies = data['data'];
      }
    })
  }
}
