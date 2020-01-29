import { PersonService } from './../person/_service/person.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { StaffService } from './_service/staff.service';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  allDistricts = [];
  allLocalBodies = [];
  allSO = [];
  allPerson = [];

  personUnderStaff = [];

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

  formControlNames = {
    staffId: 'staffId',
    staffCode: 'staffCode',
    name: 'name',
    nameNP: 'nameNP',
    monthlyPay:'monthlyPay',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }
  constructor(
    private localService: LocalBodyService,
    private staffService: StaffService,
    private personService: PersonService,
    private formBuilder: FormBuilder,
  ) {
    this.staffForm = this.formBuilder.group({
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.monthlyPay]: '',
    });

    this.updateStaffForm = this.formBuilder.group({
      [this.formControlNames.staffId]: '',
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.monthlyPay]: '',
    });
    this.filterForm = this.formBuilder.group({
      district: 'all',
      localBody: 'all'
    });
    this.getDistricts();
    this.getAllPeople();
    //this.getLocalBodies();
    //this.getSchemes();
    this.populateList();

  }

  ngOnInit() {
  }

  populateList() {
    this.allSO = [];
    this.staffService.getAllStaff().subscribe(data => {
      if (data['success'] === true) {
        this.allSO = data['data'];
      }
    });
  }

  getAllPeople(){
    this.allPerson = [];
    this.personService.getAllPerson().subscribe(data => {
      if (data['success'] === true) {
        this.allPerson = data['data'];
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
    this.setEdit = this.allSO[i];
    this.change1(this.setEdit['districtId'], 'update');
    this.updateStaffForm = this.formBuilder.group({
      [this.formControlNames.staffId]: this.setEdit['staffId'],
      [this.formControlNames.staffCode]: this.setEdit['staffCode'],
      [this.formControlNames.name]: this.setEdit['name'],
      [this.formControlNames.nameNP]: this.setEdit['nameNP'],
      [this.formControlNames.monthlyPay]: this.setEdit['monthlyPay'],
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

  getPersonsUnderStaff(staffId){
    this.staffService.getPersonsUnderStaff(staffId).subscribe(data => {
      if (data['success'] === true) {
        this.selectedStaff = staffId;
        this.personUnderStaff = data['data'];
      }
    });
  }
  addPersonUnderStaff(personId){
    let plusData = {staffId:this.selectedStaff, personId:personId};
    console.log(plusData)
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.staffService.addPersonUnderStaff(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.getPersonsUnderStaff(this.selectedStaff);
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }
  removePersonUnderStaff(staffAllocateId){
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
  
          this.staffService.removePersonUnderStaff(staffAllocateId).subscribe(data => {
            if (data['success'] === true) {
              swal.fire('Deleted', data['message'], 'info');
              this.getPersonsUnderStaff(this.selectedStaff);
            } else if (data['success'] === false) {
              swal.fire('oops', data['message'], 'error');
            }
          });
  
  
        }
      })
    
  }
}
