import { MiscService } from './../misc/_service/misc.service';
import { ContractService } from './_service/contract.service';
import { BatchService } from './../batch/_service/batch.service';
import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { LocalBodyService } from '../local-body/_service/local-body.service';
import { SoService } from '../so/_service/so.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchemeService } from '../scheme/_service/scheme.service';
import jwt_decode from 'jwt-decode';
import { RwssStaffService } from '../rwss-staff/_service/rwss-staff.service';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  soUnderPM = [];
  allDistrict = [];
  localUnderDistrict = [];
  allSchemes = [];
  miscCosts;
  allBatch = [];
  allProjectManager = [];
  selectedSchemes = [];
  staffs = [];
  persons = [];
  selectedSo;
  // soFilterArray = ['none', 'none']; // first is batch and second is PM (personId)
  loading = false;
  showNotification = false;
  contractForm: FormGroup;
  constructor(
    private localService: LocalBodyService,
    private soService: SoService,
    private batchService: BatchService,
    private rwssStaffService: RwssStaffService,
    private contractService: ContractService,
    private formBuilder: FormBuilder,
    private schemeService: SchemeService,
    private miscService: MiscService
  ) {
    this.getMiscCosts(); //getting working days of employee and misc costs
    this.getBatches();
    this.getProjectManagers();
    this.getDistricts();
    this.getSchemes();

    this.contractForm = this.formBuilder.group({
      batchId: 'none',
      soId: 'none',
      rwssStaffId: 'none',
      // districtId: 'none',
      // localBodyId: 'none',
      schemeId: 'none',
      staff: 'none',
      person: 'none',
      startYear: '',
      startMonth: '',
      startDay: '',
      endYear: '',
      endMonth: '',
      endDay: '',
    });
  }

  ngOnInit() {

  }
  addScheme(i) {
    if (i === 'none') {
      swal.fire('Wait', 'Please select valid scheme', 'info');
      return;
    }
    if (this.selectedSchemes.length < 10) {
      this.selectedSchemes.push(this.allSchemes[i]);
    } else {
      swal.fire('Wait', 'Scheme Limit Exceeded!', 'warning');
    }
  }
  removeScheme(i) {
    if (this.selectedSchemes.length > 0) {
      this.selectedSchemes.splice(i, 1);
    }
  }
  getSOUnderPM(rwssStaffId) {
    this.loading = true;
    this.rwssStaffService.getSOUnderPM(rwssStaffId).subscribe(data => {
      this.loading = false;
      if (data['success'] === true) {
        this.soUnderPM = [];
        this.soUnderPM = data['data'];
        console.log(this.soUnderPM);
      }
    });
  }


  getDistricts() {
    this.localService.getAllDistricts().subscribe(data => {
      if (data['success'] === true) {
        this.allDistrict = data['data'];
      }
    });
  }

  getLocalBodyByDistrict(id) {

    this.loading = true;
    this.localService.getLocalBodiesByDistrictId(id).subscribe(data => {
      if (data['success'] === true) {

        this.localUnderDistrict = data['data'];
      }
      this.loading = false;
    });
  }
  getSchemes() {
    this.schemeService.getAllScheme().subscribe(data => {
      if (data['success'] === true) {
        this.allSchemes = data['data'];
      }
    });
  }

  getMiscCosts() {
    this.miscService.getAllData().subscribe(data => {
      if (data['success'] == true) {
        delete data['data'][0]['id'];
        this.miscCosts = data['data'][0];
      }
    });
  }

  getBatches() {
    this.allBatch = [];
    this.batchService.getAllBatch().subscribe(data => {
      if (data['success'] === true) {
        this.allBatch = data['data'];
      }
    });
  }

  getProjectManagers() {
    this.rwssStaffService.getProjectManagers().subscribe(data => {
      if (data['success'] === true) {
        this.allProjectManager = data['data'];
      }
    });
  }


  selectDistrict(i) {
    if (i === 'none') { this.localUnderDistrict = []; return; }
    this.getLocalBodyByDistrict(i);
  }


  generateContract(data) {
    if (!this.miscCosts) {
      swal.fire('Oops', 'Could not load Misc Expenses data', 'error');
      return;
    }

    this.loading = true;
    let plusData = data;
    plusData['createdBy'] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
    plusData['createdOn'] = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let selectedSchemesId = this.selectedSchemes.map(e => { return e['schemeId'] })

    //setting misc Data info
    plusData['transportationCost'] = this.miscCosts['transportationCost'];
    plusData['communicationCost'] = this.miscCosts['communicationCost'];
    plusData['orientationCost'] = this.miscCosts['orientationCost'];
    plusData['jointMonitoringCost'] = this.miscCosts['jointMonitoringCost'];
    plusData['reportingCost'] = this.miscCosts['reportingCost'];

    //setting date
    plusData['startDate'] = data.startYear + '-' + data.startMonth + '-' + data.startDay;
    plusData['endDate'] = data.endYear + '-' + data.endMonth + '-' + data.endDay;

    console.log(this.selectedSchemes);
    plusData['schemes'] = JSON.stringify(selectedSchemesId);

    plusData['active'] = true;

    // deleting unnecessary data 
    delete plusData['schemeId'];
    delete plusData['startYear'];
    delete plusData['startMonth'];
    delete plusData['startDay'];
    delete plusData['endYear'];
    delete plusData['endMonth'];
    delete plusData['endDay'];
    delete plusData['staff'];
    delete plusData['person'];
    console.log(plusData)

    //staff data
    plusData['staff'] = JSON.stringify(this.staffs); //enter data here

    console.log(plusData)

    this.contractService.createContract(plusData).subscribe(data1 => {
      this.loading = false;
      if (data1['success'] === true) {
        swal.fire('Success', data1['message'], 'success');
        this.contractForm.reset();
      } else if (data1['success'] === false) {
        swal.fire('Oops', data1['message'], 'error');
      }
    });


  }


  //upper
  getStaffBySoId(soId) {
    this.selectedSo = soId;

    console.log(soId)
    this.soService.getStaffUnderSo(soId).subscribe(data => { //get staff and person  under so
      if (data['success'] === true) {
        console.log("got alll staff by soid ")
        console.log(data);
        this.staffs = data['data'];
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    });
  }

  //lower
  // getPersonUnderSoAndStaff(staffIndex) {
  //   //assigned under staff and so
  //   const filter = { staffId: this.staffs[staffIndex]['staffId'], 'soId': this.selectedSo };
  //   this.soService.getPersonUnderSoandStaff(filter).subscribe(data => {
  //     if (data['success'] === true) {
  //       this.persons = data['data'];
  //     }
  //   });
  // }

  addStaff(staffIndex, personIndex) {

    this.staffs[staffIndex]['person'] = this.persons[personIndex];
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
}
