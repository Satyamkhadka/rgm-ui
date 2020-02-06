import { ContractService } from './_service/contract.service';
import { BatchService } from './../batch/_service/batch.service';
import  swal  from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { LocalBodyService } from '../local-body/_service/local-body.service';
import { SoService } from '../so/_service/so.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchemeService } from '../scheme/_service/scheme.service';
import { StaffService } from '../staff/_service/staff.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  soUnderPM=[];
  allDistrict = [];
  localUnderDistrict=[];
  allSchemes = [];
  allBatch = [];
  allProjectManager = [];
  selectedSchemes = [];
  selectedSo = [];

  soFilterArray = ['none','none']; // first is batch and second is PM (personId)
  loading = false;
  showNotification = false;
  contractForm:FormGroup;
  constructor(
    private localService: LocalBodyService,
    private soService: SoService,
    private batchService: BatchService,
    private staffService: StaffService,
    private contractService: ContractService,
    private formBuilder: FormBuilder,
    private schemeService: SchemeService
  ) { 
this.getBatches();
this.getProjectManagers();
this.getDistricts();
this.getSchemes();

this.contractForm = this.formBuilder.group({
  batchId:'none',
  soId:'none',
  personId:'none',
  districtId:'none',
  localBodyId:'none',
  schemeId:'none',
});
  }

  ngOnInit() {
    
  }
  addScheme(i) {
    if(i==='none') {
      swal.fire('Wait','Please select valid scheme','info');
      return;
    }
    if(this.selectedSchemes.length<10){
   this.selectedSchemes.push(this.allSchemes[i]);
    } else {
      swal.fire('Wait','Scheme Limit Exceeded!','warning');
    }
  }
  removeScheme(i) {
    if(this.selectedSchemes.length>0){
      this.selectedSchemes.splice(i,1);
    }
  }
  getSoUnderPM(personId) {
    this.loading = true;
    this.staffService.getSOUnderPM(personId).subscribe(data => {
     this.loading = false;
      if (data['success'] === true) {
        this.soUnderPM = [];
        this.soUnderPM = data['data'];
        this.soUnderPM=this.soUnderPM.filter(el=>{
          if(el['batchId']==this.soFilterArray[0]){
            return true;
          }
        })
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
  getSchemes(){
    this.schemeService.getAllScheme().subscribe(data => {
      if (data['success'] === true) {
        this.allSchemes = data['data'];
      }
    });
  }
  getBatches(){
    this.allBatch = [];
    this.batchService.getAllBatch().subscribe(data => {
      if (data['success'] === true) {
        this.allBatch = data['data'];
      }
    });
  }

  getProjectManagers(){
    this.staffService.getProjectManagers().subscribe(data => {
      if (data['success'] === true) {
        this.allProjectManager = data['data'];
      }
    });
  }


selectDistrict(i){
  if(i==='none'){ this.localUnderDistrict=[]; return;}
this.getLocalBodyByDistrict(i);
}

changeSoFilter(index, id){
  this.soFilterArray[index] = id;
  if(this.soFilterArray[0]!=='none' && this.soFilterArray[1]!=='none'){
    this.showNotification = false;
    this.getSoUnderPM(this.soFilterArray[1]);
  } else {
    this.showNotification = true;
  }
}

generateContract(data){
  let plusData = data;
  delete plusData['schemeId'];
  plusData['createdBy'] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;
  plusData['createdOn'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
  plusData['schemes'] = JSON.stringify(this.selectedSchemes);
  plusData['active'] = true;
  console.log(plusData)

  this.contractService.createContract(plusData).subscribe(data => {
    if (data['success'] === true) {
      swal.fire('Success', data['message'], 'success');
      //do something here ... 
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
}
