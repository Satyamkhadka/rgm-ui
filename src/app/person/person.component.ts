import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PersonService } from './_service/person.service';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

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
  filter: any = { searchKey: '' };

  personForm: FormGroup;
  updatePersonForm: FormGroup;
  filterForm: FormGroup;

  formControlNames = {
    personId: 'personId',
    personCode: 'personCode',
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    firstNameNP: 'firstNameNP',
    middleNameNP: 'middleNameNP',
    lastNameNP: 'lastNameNP',
    lsi: 'lsi',
    gender: 'gender',
    mStatus: 'mStatus',
    citizenshipNo: 'citizenshipNo',
    districtId: 'districtId',
    localBodyId: 'localBodyId',
    ward: 'ward',
    address: 'address',
    phone1: 'phone1',
    phone2: 'phone2',
    mobile: 'mobile',
    email: 'email',
    web: 'web',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private personService: PersonService,
    private formBuilder: FormBuilder
  ) {
    this.personForm = this.formBuilder.group({
      [this.formControlNames.personCode]: '',
      [this.formControlNames.firstName]: '',
      [this.formControlNames.middleName]: '',
      [this.formControlNames.lastName]: '',
      [this.formControlNames.firstNameNP]: '',
      [this.formControlNames.middleNameNP]: '',
      [this.formControlNames.lastNameNP]: '',
      [this.formControlNames.lsi]: '',
      [this.formControlNames.gender]: 'Male',
      [this.formControlNames.mStatus]: 'Single',
      [this.formControlNames.citizenshipNo]: '',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.ward]: '',
      [this.formControlNames.address]: '',
      [this.formControlNames.phone1]: '',
      [this.formControlNames.phone2]: '',
      [this.formControlNames.mobile]: '',
      [this.formControlNames.email]: '',
      [this.formControlNames.web]: '',
    });

    this.updatePersonForm = this.formBuilder.group({
      [this.formControlNames.personId]: '',
      [this.formControlNames.personCode]: '',
      [this.formControlNames.firstName]: '',
      [this.formControlNames.middleName]: '',
      [this.formControlNames.lastName]: '',
      [this.formControlNames.firstNameNP]: '',
      [this.formControlNames.middleNameNP]: '',
      [this.formControlNames.lastNameNP]: '',
      [this.formControlNames.lsi]: '',
      [this.formControlNames.gender]: '',
      [this.formControlNames.mStatus]: '',
      [this.formControlNames.citizenshipNo]: '',
      [this.formControlNames.districtId]: '',
      [this.formControlNames.localBodyId]: '',
      [this.formControlNames.ward]: '',
      [this.formControlNames.address]: '',
      [this.formControlNames.phone1]: '',
      [this.formControlNames.phone2]: '',
      [this.formControlNames.mobile]: '',
      [this.formControlNames.email]: '',
      [this.formControlNames.web]: '',
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
    this.personService.getAllPerson().subscribe(data => {
      if (data['success'] === true) {
        this.allSO = data['data'];

        let temp;
        this.allSO = this.allSO.map(e => {
          temp = e;
          temp['searchKey'] = e.firstName + ' ' + e.middleName + ' ' + e.lastName + ' ' + e.email + ' ' + e.personCode;
          return temp;
        });


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
    this.personService.createPerson(plusData).subscribe(data => {
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

        this.personService.deletePerson(id).subscribe(data => {
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

  edit(data) {

    this.setEdit = data;
    console.log(this.allSO);
    this.change1(this.setEdit['districtId'], 'update');
    this.updatePersonForm = this.formBuilder.group({
      [this.formControlNames.personId]: this.setEdit['personId'],
      [this.formControlNames.personCode]: this.setEdit['personCode'],
      [this.formControlNames.firstName]: this.setEdit['firstName'],
      [this.formControlNames.middleName]: this.setEdit['middleName'],
      [this.formControlNames.lastName]: this.setEdit['lastName'],
      [this.formControlNames.firstNameNP]: this.setEdit['firstNameNP'],
      [this.formControlNames.middleNameNP]: this.setEdit['middleNameNP'],
      [this.formControlNames.lastNameNP]: this.setEdit['lastNameNP'],
      [this.formControlNames.lsi]: this.setEdit['lsi'],
      [this.formControlNames.gender]: this.setEdit['gender'],
      [this.formControlNames.mStatus]: this.setEdit['mStatus'],
      [this.formControlNames.citizenshipNo]: this.setEdit['citizenshipNo'],
      [this.formControlNames.districtId]: this.setEdit['districtId'],
      [this.formControlNames.localBodyId]: this.setEdit['localBodyId'],
      [this.formControlNames.ward]: this.setEdit['ward'],
      [this.formControlNames.address]: this.setEdit['address'],
      [this.formControlNames.phone1]: this.setEdit['phone1'],
      [this.formControlNames.phone2]: this.setEdit['phone2'],
      [this.formControlNames.mobile]: this.setEdit['mobile'],
      [this.formControlNames.email]: this.setEdit['email'],
      [this.formControlNames.web]: this.setEdit['web'],
    });
  }

  doEdit(data) {
    this.personService.updatePerson(data).subscribe(data => {
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
          console.log('updated update ')
          this.updateLBUnderDistrict = data['data'];
        } else if (source === 'filter') { this.filterLBUnderDistrict = data['data']; }
      }
    })
  }
  change1(event, source) {
    this.setLocalBodyByDistrict(event, source);
  }

}
