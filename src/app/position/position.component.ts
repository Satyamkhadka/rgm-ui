import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PositionService } from './_service/position.service';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  allDistricts = [];
  allLocalBodies = [];
  allSO = [];
  createLBUnderDistrict = [];
  filterLBUnderDistrict = [];
  updateLBUnderDistrict = [];
  activeLocalBodyFilter = "all";
  activeDistrictFilter = 'all';
  setEdit;
  loading = false;

  positionForm: FormGroup;
  updatePositionForm: FormGroup;
  filterForm: FormGroup;

  formControlNames = {
    positionId: 'positionId',
    positionCode: 'positionCode',
    name: 'name',
    nameNP: 'nameNP',
    monthlyPay:'monthlyPay',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private positionService: PositionService,
    private formBuilder: FormBuilder
  ) {
    this.positionForm = this.formBuilder.group({
      [this.formControlNames.positionCode]: '',
      [this.formControlNames.monthlyPay]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
    });

    this.updatePositionForm = this.formBuilder.group({
      [this.formControlNames.positionId]: '',
      [this.formControlNames.positionCode]: '',
      [this.formControlNames.monthlyPay]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
    });
    this.filterForm = this.formBuilder.group({
      district: 'all',
      localBody: 'all'
    });
    this.getDistricts();
    //this.getLocalBodies();
    //this.getSchemes();
    this.populateList();

  }

  ngOnInit() {
  }

  populateList() {
    this.allSO = [];
    this.positionService.getAllPosition().subscribe(data => {
      if (data['success'] === true) {
        this.allSO = data['data'];
      }
    });
  }

  getDistricts() {
    this.localService.getAllDistricts().subscribe(data => {
      if (data['success'] === true) {
        this.allDistricts = data['data'];
      }
    });
  }
  create(data) {
    console.log(data);
    let plusData = data;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.positionService.createPosition(plusData).subscribe(data => {
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

        this.positionService.deletePosition(id).subscribe(data => {
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
    this.setEdit = this.allSO[i];
    this.change1(this.setEdit['districtId'], 'update');
    this.updatePositionForm = this.formBuilder.group({
      [this.formControlNames.positionId]: this.setEdit['positionId'],
      [this.formControlNames.positionCode]: this.setEdit['positionCode'],
      [this.formControlNames.monthlyPay]: this.setEdit['monthlyPay'],
      [this.formControlNames.name]: this.setEdit['name'],
      [this.formControlNames.nameNP]: this.setEdit['nameNP'],
    });
  }

  doEdit(data) {
    this.positionService.updatePosition(data).subscribe(data => {
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

}
