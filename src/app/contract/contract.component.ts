import { LocalBodyService } from './../local-body/_service/local-body.service';
import { ContractService } from './../input/_service/contract.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import NepaliDate from 'nepali-date/cjs';
import { NgxNepaliNumberToWordsService } from 'ngx-nepali-number-to-words';
import { StaffService } from '../staff/_service/staff.service';
import {
  englishNumberFormat, englishToNepaliNumber,
} from "nepali-number";
import { RwssStaffService } from '../rwss-staff/_service/rwss-staff.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  contractId;
  contractDetails = {};
  ed = {};
  schemes = [];
  numberOfSchemes: number;
  staff = [];
  calculatedData = {};
  district = '';
  localBody = '';

  miscData = {}; //misc exprenses with orientation ocost and the employee works 

  //percentage 
  overhead = 15;
  vat = 13;

  //dates 
  startDate;
  endDate;
  createdDate;
  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private localBodyService: LocalBodyService,
    private nepaliService: NgxNepaliNumberToWordsService,
    private staffService: StaffService,
    private rwssStaffService: RwssStaffService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get("contractId");
      if (this.contractId) {
        this.getContractById(this.contractId);
        this.getRwssStaffs();
      }
    });
  }

  printPage() {
    window.print();
  }

  getContractById(contractId) {
    this.contractService.getContractById(contractId).subscribe(data => {
      console.log(data)
      if (data['success'] === true) {
        this.contractDetails = data['data'][0];
        this.schemes = this.contractDetails['schemes'];
        this.numberOfSchemes = this.schemes.length;
        this.staff = this.contractDetails['staff'];
        this.calculateData();

        for (let i = 0; i < this.schemes.length; i++) {
          this.schemes[i]['district'] = '-';
          this.schemes[i]['localBody'] = '-';
          // console.log(this.schemes[i])
          if (this.schemes[i]['districtId']) {
            this.localBodyService.getDistrictById(this.schemes[i]['districtId']).subscribe(data => { //get staff under so

              if (data['success'] === true) {
                this.schemes[i]['district'] = data['data'][0]['nameNP'];
              }
            });
          }
          if (this.schemes[i]['localBodyId']) {

            this.getLocalBodyById(this.contractDetails['localBodyId']);
            this.localBodyService.getLocalBodyById(this.schemes[i]['localBodyId']).subscribe(data => { //get staff under so
              if (data['success'] === true) {
                this.schemes[i]['localBody'] = data['data'][0]['nameNP'];
              }
            });
          }
        }
      }
    })
  }


  getLocalBodyById(localBodyId) {
    this.localBodyService.getLocalBodyById(localBodyId).subscribe(data => { //get staff under so
      if (data['success'] === true) {
        this.localBody = data['data'][0]['nameNP'];
      }
    });
  }

  getRwssStaffs() {
    console.log('special staff')
    this.rwssStaffService.getAllStaff().subscribe(data => {
      console.log(data)
      if (data['success']) {
        this.ed = data['data'].filter(e => {
          if (e['name'] === 'Executive Director' || e['name'] === 'executive director') {
            return e;
          }
        });
        this.ed = this.ed[0] ? this.ed[0] : null;

      }
    })
  }

  calculateData() {

    //ummm.... dates 
    this.startDate = new NepaliDate(this.contractDetails['startDate']); //start nepali date
    this.endDate = new NepaliDate(this.contractDetails['endDate']); //end nepali date
    this.startDate = this.startDate.format('yyyy-mmmm-dd , ddd');
    this.endDate = this.endDate.format('yyyy-mmmm-dd , ddd');
    console.log(this.contractDetails['createdOn']);
    this.createdDate = new NepaliDate(new Date(this.contractDetails['createdOn']));
    //this.createdDate = this.createdDate.format('yyyy-mmmm-dd , ddd');
    console.log(this.createdDate.format('yyyy-mm-dd'))
    //hr part 
    this.calculatedData['hrSubTotal'] = 0;

    this.calculatedData['staffs'] = [];
    let temp = {};

    this.staff.forEach(e => {
      temp = { name: e.name, nameNP: e.nameNP };
      temp['fairPay'] = +(((e['monthlyPay'] / 30) * e['workingDays']) * this.numberOfSchemes).toFixed(2);
      temp['person'] = e;
      temp['workingDays'] = +(e['workingDays'] * this.numberOfSchemes).toFixed(2);

      this.calculatedData['hrSubTotal'] += +(temp['fairPay']).toFixed(2);
      this.calculatedData['staffs'].push(temp);
    });



    this.calculatedData['hrOverhead'] = +(this.overhead / 100 * this.calculatedData['hrSubTotal']).toFixed(2);
    this.calculatedData['hrTotal'] = +(this.calculatedData['hrSubTotal'] + this.calculatedData['hrOverhead']).toFixed(2);


    // misc part
    this.miscData['transportationCost'] = +(this.contractDetails['transportationCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['communicationCost'] = +(this.contractDetails['communicationCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['reportingCost'] = +(this.contractDetails['reportingCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['jointMonitoringCost'] = +(this.contractDetails['jointMonitoringCost'] * this.numberOfSchemes).toFixed(2);
    this.calculatedData['orientationCost'] = +(this.contractDetails['orientationCost'] * this.numberOfSchemes).toFixed(2);


    this.calculatedData['miscTotal'] = 0;
    for (let item in this.miscData) {
      this.calculatedData[item] = this.miscData[item];
      this.calculatedData['miscTotal'] += this.miscData[item];
    }
    this.calculatedData['total'] = +(this.calculatedData['hrTotal'] + this.calculatedData['miscTotal'] + this.calculatedData['orientationCost']).toFixed(2);
    this.calculatedData['vat'] = +(this.vat / 100 * this.calculatedData['total']).toFixed(2);
    this.calculatedData['grandTotal'] = +(this.calculatedData['total'] + this.calculatedData['vat']).toFixed(2);
    // this.calculatedData['grandTotalWR'] = NumberToWords.toWords(this.calculatedData['grandTotal'].toFixed());
    this.calculatedData['grandTotalWR'] = this.nepaliService.toWords(+this.calculatedData['grandTotal'], 'money');
    // this.NgxNepaliNumberToWordsService.toWords(10025, 'money')

    this.calculatedData['hrSubTotal70'] = +(0.70 * this.calculatedData['hrSubTotal']).toFixed(2);
    this.calculatedData['hrSubTotal30'] = +(0.30 * this.calculatedData['hrSubTotal']).toFixed(2);

    console.log(this.calculatedData)
  }


  format(data) {
    let returnvalue = englishNumberFormat(data, 'ne');
    return returnvalue;
  }

  nep(data) {
    let returnvalue = englishToNepaliNumber(data);
    return returnvalue;
  }
}