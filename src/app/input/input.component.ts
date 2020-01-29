import { BatchService } from './../batch/_service/batch.service';
import  swal  from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { LocalBodyService } from '../local-body/_service/local-body.service';
import { SoService } from '../so/_service/so.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchemeService } from '../scheme/_service/scheme.service';
import { StaffService } from '../staff/_service/staff.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  allSo=[];
  allDistrict = [];
  localUnderDistrict=[];
  allSchemes = [];
  allBatch = [];
  allProjectManager = [];
  selectedSchemes = [];
  loading = false;
  contractForm:FormGroup;
  constructor(
    private localService: LocalBodyService,
    private soService: SoService,
    private batchService: BatchService,
    private staffService: StaffService,
    private formBuilder: FormBuilder,
    private schemeService: SchemeService
  ) { 
this.getBatches();
this.getProjectManagers();
this.getAllSo();
this.getDistricts();
this.getSchemes();

this.contractForm = this.formBuilder.group({
  batchId:'none',
  soId:'none',
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
  getAllSo() {
    this.soService.getAllSo().subscribe(data => {
      if (data['success'] === true) {
        this.allSo = data['data'];
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
}
