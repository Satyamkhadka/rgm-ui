import { SoService } from '../so/_service/so.service';
import { PersonService } from '../person/_service/person.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PmService } from './_service/pm.service';
import { LocalBodyService } from '../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
import { BatchService } from '../batch/_service/batch.service';
@Component({
  selector: 'app-pm',
  templateUrl: './pm.component.html',
  styleUrls: ['./pm.component.css']
})
export class PmComponent implements OnInit {

  allDistricts = [];
  allLocalBodies = [];
  allPm = [];
  allSo = [];
  allPerson = [];
  allBatch = [];
managerInfo = [];
  personUnderPm = [];
  SOUnderPM = [];
  selectedSoUnderBatch;
  selectedBatch = 'all';


  createLBUnderDistrict = [];
  filterLBUnderDistrict = [];
  updateLBUnderDistrict = [];
  activeLocalBodyFilter = "all";
  activeDistrictFilter = 'all';
  selectedPm = '';
  setEdit;
  loading = false;

  pmForm: FormGroup;
  updatePmForm: FormGroup;
  filterForm: FormGroup;

  formControlNames = {
    staffId: 'staffId',
    staffCode: 'staffCode',
    name: 'name',
    batchId:'batchId',
    nameNP: 'nameNP',
    monthlyPay: 'monthlyPay',
    projectManager: 'projectManager',
    active: 'active',
    createdBy: 'createdBy',
    createdOn: 'createdOn'
  }

  personControlNames = {
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
    private pmService: PmService,
    private soService: SoService,
    private batchService: BatchService,
    private personService: PersonService,
    private formBuilder: FormBuilder,
  ) {
    this.pmForm = this.formBuilder.group({
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.monthlyPay]: '',
      [this.formControlNames.projectManager]: '',
    });

    this.updatePmForm = this.formBuilder.group({
      [this.formControlNames.staffId]: '',
      [this.formControlNames.staffCode]: '',
      [this.formControlNames.name]: '',
      [this.formControlNames.nameNP]: '',
      [this.formControlNames.monthlyPay]: '',
      [this.formControlNames.projectManager]: '',

    });
    this.filterForm = this.formBuilder.group({
      batchId: 'all'
    });
    this.getProjectManagerSettings();
    this.getAllBatch();
    this.getAllPeople();
    this.populateList();
    this.getAllSo();

  }

  ngOnInit() {
  }

  populateList() {
    this.allPm = [];
    this.pmService.getProjectManagers().subscribe(data => {
      if (data['success'] === true) {
        console.log(data);
        this.allPm = data['data'];
      }
    });
  }

  getAllPeople() {
    this.allPerson = [];
    this.personService.getAllPerson().subscribe(data => {
      if (data['success'] === true) {
        this.allPerson = data['data'];
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
 private  create(data) {
    let plusData = data;
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.pmService.createPm(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', 'PM didnt exists so created new PM', 'success');
        this.edit();
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


private getProjectManagerSettings(){
  this.pmService.getProjectManagerSettings().subscribe(data => {
    if (data['success'] === true) {
      console.log(data)
      if (data['data'][0]) {
        this.managerInfo = data['data'][0];
      } else {
        console.log('creatin')
        this.create({staffCode:'PM/PM',projectManager:true, name:'Project Manager', nameNP:'Project Manager', monthlyPay:'0'})
      }
      
    } 
  });
}
  edit() {
    this.updatePmForm = this.formBuilder.group({
      [this.formControlNames.staffId]: this.managerInfo['staffId'],
      [this.formControlNames.staffCode]: this.managerInfo['staffCode'],
      [this.formControlNames.name]: this.managerInfo['name'],
      [this.formControlNames.nameNP]: this.managerInfo['nameNP'],
      [this.formControlNames.monthlyPay]: this.managerInfo['monthlyPay'],
      [this.formControlNames.projectManager]: this.managerInfo['projectManager'],
    });
  }

  doEdit(data) {
    this.pmService.updatePm(data).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.getProjectManagerSettings();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    })
  }



  // getPersonsUnderPm(staffId) {
  //   this.pmService.getPersonsUnderPm(staffId).subscribe(data => {
  //     if (data['success'] === true) {
  //       this.selectedPm = staffId;
  //       this.personUnderPm = data['data'];
  //     }
  //   });
  // }
  addPersonUnderPm(personId) {
    let plusData = { staffId: this.managerInfo['staffId'], personId: personId };
    console.log(plusData)
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    this.pmService.addPersonUnderPm(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
       this.populateList();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }
  removePersonUnderPm(staffAllocateId) {
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

        this.pmService.removePersonUnderPm(staffAllocateId).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.populateList();
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });


      }
    })

  }
  //pm part
  getSOUnderPM(personId) {
    this.pmService.getSOUnderPM(personId).subscribe(data => {
      if (data['success'] === true) {
        this.selectedPm = personId;
        this.SOUnderPM = data['data'];
        this.selectBatch(this.selectedBatch);
      }
    });
  }
  addSOUnderPM(soId) {
    console.log(soId)
    if(this.selectedBatch==='all'){
      swal.fire('Oops','Please select batch first', 'info');
      return;
    }
    let plusData = { personId: this.selectedPm, soId: soId };
    plusData[this.formControlNames.batchId] = this.selectedBatch;
    
    plusData[this.formControlNames.createdBy] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData[this.formControlNames.createdOn] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    plusData[this.formControlNames.active] = true;
    console.log(plusData)
    this.pmService.addSOUnderPM(plusData).subscribe(data => {
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.getSOUnderPM(this.selectedPm);
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }
  removeSOUnderPM(pmAllocateId) {
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

        this.pmService.removeSOUnderPM(pmAllocateId).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.getSOUnderPM(this.selectedPm);
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });


      }
    })

  }
  getAllBatch(){
    this.batchService.getAllBatch().subscribe(data=>{
      if (data['success'] === true) {
        this.allBatch = data['data'];
      }
    })
  }
  selectBatch(batchId){
    this.selectedBatch = batchId;
    this.selectedSoUnderBatch = this.SOUnderPM;
    if(batchId === 'all'){
      return;
    }
    this.selectedSoUnderBatch  = this.SOUnderPM.filter(el=>{
      if(el['batchId']==batchId){
        return true;
      } else return false;
    })
  }

 
}
