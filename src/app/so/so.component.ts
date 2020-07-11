import { StaffService } from './../staff/_service/staff.service';
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
  allStaff = [];
  createLBUnderDistrict = [];
  filterLBUnderDistrict = [];
  updateLBUnderDistrict = [];
  personUnderStaff = [];
  personUnderAssignedStaff = [];
  staffUnderSo = [];
  activeLocalBodyFilter = "all";
  activeDistrictFilter = 'all';
  setEdit;
  loading = false;
  selectedSo;
  filter: any = { name: '' };
  soForm: FormGroup;
  updateSoForm: FormGroup;
  filterForm: FormGroup;
  assignForm: FormGroup;

  formControlNames = {
    soId: 'soId',
    soCode: 'soCode',
    name: 'name',
    nameNP: 'nameNP',
    street: 'street',
    ward: 'ward',
    vdcId: 'vdcId',
    districtId: 'districtId',
    // localBodyId: 'localBodyId',
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
    private soService: SoService,
    private formBuilder: FormBuilder,
    private staffService: StaffService
  ) {
    this.soForm = this.formBuilder.group({
      [this.formControlNames.soCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.street]: '',
      [this.formControlNames.ward]: '',
      // [this.formControlNames.vdcId]:'',
      [this.formControlNames.districtId]: '',
      // [this.formControlNames.localBodyId]: '',
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

    this.updateSoForm = this.formBuilder.group({
      [this.formControlNames.soId]: '',
      [this.formControlNames.soCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.street]: '',
      [this.formControlNames.ward]: '',
      //[this.formControlNames.vdcId]:'',
      [this.formControlNames.districtId]: '',
      // [this.formControlNames.localBodyId]: '',
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
    this.assignForm = this.formBuilder.group({
      staffId: 'none',
      personId: 'none'
    });

    this.getDistricts();
    this.populateList();
    this.getAllStaff();

  }

  ngOnInit() {
  }

  populateList() {
    this.loading = true;

    this.allSO = [];
    this.soService.getAllSo().subscribe(data => {
      this.loading = false;

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
    this.soService.createSo(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.diffrentialLoding();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }

  getLocalBodyByDistrict(districtId) {
    this.activeLocalBodyFilter = districtId;
    if (districtId.district === 'all' || districtId.district === '') {
      this.activeLocalBodyFilter = 'all';
      this.diffrentialLoding();

      return;
    }
    // this.localService.getLocalBodiesByDistrictId(districtId.district).subscribe(data => {
    //   if (data['success'] === true) {
    //     this.allLocalBodies = [];
    //     this.allLocalBodies = data['data'];
    //     this.loading = false;
    //   }
    // })
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
    if (this.activeLocalBodyFilter === 'all') {
      this.populateList();
    } else {
      this.getSoBy(this.activeDistrictFilter, this.activeLocalBodyFilter);
    }
  }

  edit(data) {
    this.setEdit = data;
    this.change1(this.setEdit['districtId'], 'update');
    this.updateSoForm = this.formBuilder.group({
      [this.formControlNames.soId]: this.setEdit['soId'],
      [this.formControlNames.soCode]: this.setEdit['soCode'],
      [this.formControlNames.name]: this.setEdit['name'],
      [this.formControlNames.nameNP]: this.setEdit['nameNP'],
      [this.formControlNames.street]: this.setEdit['street'],
      [this.formControlNames.ward]: this.setEdit['ward'],
      //[this.formControlNames.vdcId]:this.setEdit['vdcId'],
      [this.formControlNames.districtId]: this.setEdit['districtId'],
      //[this.formControlNames.localBodyId]: this.setEdit['localBodyId'],
      [this.formControlNames.address]: this.setEdit['address'],
      [this.formControlNames.poBox]: this.setEdit['poBox'],
      [this.formControlNames.phone1]: this.setEdit['phone1'],
      [this.formControlNames.phone2]: this.setEdit['phone2'],
      [this.formControlNames.mobile]: this.setEdit['mobile'],
      [this.formControlNames.email]: this.setEdit['email'],
      [this.formControlNames.fax]: this.setEdit['fax'],
      [this.formControlNames.contactPerson]: this.setEdit['contactPerson'],
      [this.formControlNames.cDesignation]: this.setEdit['cDesignation'],
      [this.formControlNames.cPhone]: this.setEdit['cPhone'],
      [this.formControlNames.cMobile]: this.setEdit['cMobile'],
      [this.formControlNames.active]: this.setEdit['active'],
      // [this.formControlNames.createdBy]: this.setEdit['createdBy'],
      //  [this.formControlNames.createdOn]: this.setEdit['createdOn']
    });
  }

  doEdit(data) {
    this.soService.updateSo(data).subscribe(data => {
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

  getSoBy(by, id) {
    if (by === 'district') {
      if (id === 'all') { this.activeDistrictFilter = 'all'; this.activeLocalBodyFilter = 'all'; this.populateList(); return; }
      this.soService.getSoByDistrictId(id).subscribe(data => {
        if (data['success']) {
          this.allSO = data['data'];
          this.activeDistrictFilter = 'district';
          this.activeLocalBodyFilter = id;
        }
      });
    } else if (by === 'localBody') {
      if (id === 'all') { this.activeLocalBodyFilter = 'all'; this.getSoBy('district', this.activeDistrictFilter); return; }
      this.soService.getSoByLocalBodyId(id).subscribe(data => {
        if (data['success']) {
          this.allSO = data['data'];
          this.activeDistrictFilter = 'localBody';
          this.activeLocalBodyFilter = id;
        }
      });
    }
  }

  getAllStaff() {
    this.allStaff = [];
    this.staffService.getAllStaff().subscribe(data => {
      if (data['success'] === true) {
        this.allStaff = data['data'];
        this.allStaff = this.allStaff.filter(e => {
          if (e['portfolioManager'] || e['projectManager'] || e['name'] == 'Executive Director') {
            return false;
          } else return true;
        })
      }
    });
  }
  selectSo(soId) {
    console.log('seelct')
    this.selectedSo = soId;
    console.log(soId)
    this.staffUnderSo = [];
    this.soService.getStaffUnderSo(this.selectedSo).subscribe(data => { //get staff under so
      if (data['success'] === true) {
        console.log(data)
        this.staffUnderSo = data['data'];

      }
    });
  }
  getPersonUnderStaff(staffId) { //for dropdown
    this.staffService.getPersonsUnderStaff(staffId).subscribe(data => {
      console.log(data)
      if (data['success'] === true) {
        this.personUnderStaff = data['data'];
      }
    });
  }

  assignStaffUnderSo(data) {
    console.log(data);
    let plusData = data;
    plusData['personId'] = data['personId'];
    plusData['soId'] = this.selectedSo;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.soService.assignStaffUnderSo(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.selectSo(this.selectedSo);
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }

  // getPersonAssignedUnderStaff(staffId) { //assigned under staff and so
  //   const filter = { staffId, 'soId': this.selectedSo }
  //   this.soService.getPersonUnderSoandStaff(filter).subscribe(data => {
  //     if (data['success'] === true) {
  //       if (data['data'].length > 0) {
  //         this.personUnderAssignedStaff = data['data'];
  //         console.log(this.personUnderAssignedStaff)
  //       }
  //     }
  //   });
  // }
  removePersonAssignedUnderStaff(staffAllocateId) {
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
        this.soService.removePersonUnderSoandStaff(staffAllocateId).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.selectSo(this.selectedSo);
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });
      }
    })
  }
}
