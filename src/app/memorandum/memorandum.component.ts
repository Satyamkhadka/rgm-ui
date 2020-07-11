import { StaffService } from './../staff/_service/staff.service';
import { PaymentService } from './../payment/_service/payment.service';
import { MemoService } from './_service/memo.service';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import { ContractService } from './../input/_service/contract.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import NepaliDate from 'nepali-date/cjs';
import NumberToWords from 'number-to-words';

import { NgxNepaliNumberToWordsService } from 'ngx-nepali-number-to-words';
@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.css']
})
export class MemorandumComponent implements OnInit {


  contractId;
  memoId;
  memo;
  contractDetails = {};
  schemes = [];
  numberOfSchemes: number;
  staff = [];
  allStaffs = {};
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
  startDateEN;
  endDateEN;
  contractDuration: number;
  createdDate;
  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private localBodyService: LocalBodyService,
    private nepaliService: NgxNepaliNumberToWordsService,
    private memoService: MemoService,
    private paymentService: PaymentService,
    private staffService: StaffService
  ) { }

  ngOnInit() {
    this.getAllStaffs();
    this.route.paramMap.subscribe(params => {

      this.memoId = params.get("memoId");

      if (this.memoId) {
        this.getMemoById(this.memoId);
      }
    });
  }

  printPage() {
    window.print();
  }

  getAllStaffs() {
    this.staffService.getAllStaff().subscribe(data => {
      if (data['success'] === true) {
        data['data'].forEach(element => {
          this.allStaffs[element['staffId']] = element;

        });
      }
    });
  }


  getMemoById(memoId) {
    this.memoService.getMemoById(memoId).subscribe(data => {
      console.log(data)
      if (data['success'] == true) {
        this.memo = data['data'][0];
        this.memo['date'] = this.memo['date'].slice(0, 10);
        this.getContractById(this.memo.contractId);
      }
    })
  }


  getContractById(contractId) {
    this.contractService.getContractById(contractId).subscribe(data => {
      console.log('loading contract')
      console.log(data)
      if (data['success'] === true) {
        this.contractDetails = data['data'][0];
        this.schemes = this.contractDetails['schemes'];
        this.numberOfSchemes = this.schemes.length;
        this.staff = this.contractDetails['staff'];
        this.calculateData();

        this.getDistrictById(this.contractDetails['districtId']); //district is not got by contract
        // this.getLocalBodyById(this.contractDetails['localBodyId']);


      }
    })
  }


  // getLocalBodyById(localBodyId) {
  //   this.localBodyService.getLocalBodyById(localBodyId).subscribe(data => { //get staff under so
  //     if (data['success'] === true) {
  //       this.localBody = data['data'][0]['nameNP'];
  //     }
  //   });
  // }


  getDistrictById(districtId) {
    this.localBodyService.getDistrictById(districtId).subscribe(data => { //get staff under so
      if (data['success'] === true) {
        this.district = data['data'][0]['name'];
      }
    });
  }


  calculateData() {

    //ummm.... dates 
    this.startDate = new NepaliDate(this.contractDetails['startDate']); //start nepali date
    this.endDate = new NepaliDate(this.contractDetails['endDate']); //end nepali date

    this.startDateEN = this.startDate.getEnglishDate();
    this.endDateEN = this.endDate.getEnglishDate();

    this.contractDuration = this.endDateEN - this.startDateEN;
    console.log(this.startDate + '---' + this.endDate + '---' + this.contractDuration);

    this.startDate = this.startDate.format('yyyy-mmmm-dd , ddd');
    this.endDate = this.endDate.format('yyyy-mmmm-dd , ddd');
    this.createdDate = new NepaliDate(this.contractDetails['createdOn']);
    this.createdDate = this.createdDate.format('yyyy-mmmm-dd , ddd');
    //hr part 
    this.calculatedData['hrSubTotal'] = 0;
    this.calculatedData['fairHrSubTotal'] = 0;
    this.staff.forEach(e => {
      this.calculatedData[e.name] = {};
      this.calculatedData[e.name]['monthlyPay'] = e['monthlyPay'];
      this.calculatedData[e.name]['fairMonthlyPay'] = (e['monthlyPay'] / 30) * e['workingDays'];
      this.calculatedData[e.name]['payable'] = ((e['monthlyPay'] / 30) * e['workingDays']) * this.numberOfSchemes;
      this.calculatedData[e.name]['person'] = e['person'];
      this.calculatedData[e.name]['workingDays'] = e['workingDays'];
      this.calculatedData[e.name]['fairWorkingDays'] = e['workingDays'] * this.numberOfSchemes;
      //totals
      this.calculatedData['hrSubTotal'] += this.calculatedData[e.name]['fairMonthlyPay'];
      this.calculatedData['fairHrSubTotal'] += this.calculatedData[e.name]['payable'];
    });
    //overheads
    this.calculatedData['hrOverhead'] = this.overhead / 100 * this.calculatedData['hrSubTotal'];
    this.calculatedData['hrTotal'] = this.calculatedData['hrSubTotal'] + this.calculatedData['hrOverhead'];
    this.calculatedData['fairHrOverhead'] = this.overhead / 100 * this.calculatedData['fairHrSubTotal'];
    this.calculatedData['fairHrTotal'] = this.calculatedData['fairHrSubTotal'] + this.calculatedData['fairHrOverhead'];


    // misc part
    this.miscData['transportationCost'] = this.contractDetails['transportationCost'] * this.numberOfSchemes;
    this.miscData['communicationCost'] = this.contractDetails['communicationCost'] * this.numberOfSchemes;
    this.miscData['reportingCost'] = this.contractDetails['reportingCost'] * this.numberOfSchemes;
    this.miscData['jointMonitoringCost'] = this.contractDetails['jointMonitoringCost'] * this.numberOfSchemes;

    this.calculatedData['orientationCost'] = this.contractDetails['orientationCost'];
    this.calculatedData['fairOrientationCost'] = this.contractDetails['orientationCost'] * this.numberOfSchemes;

    this.calculatedData['miscTotal'] = 0;
    this.calculatedData['fairMiscTotal'] = 0;
    for (let item in this.miscData) {
      this.calculatedData[item] = this.miscData[item];
      this.calculatedData['fairMiscTotal'] += this.miscData[item];
      this.calculatedData['miscTotal'] += this.contractDetails[item];
    }

    this.calculatedData['total'] = this.calculatedData['hrTotal'] + this.calculatedData['miscTotal'] + this.calculatedData['orientationCost'];
    this.calculatedData['fairTotal'] = this.calculatedData['fairHrTotal'] + this.calculatedData['fairMiscTotal'] + this.calculatedData['fairOrientationCost'];

    this.calculatedData['vat'] = this.vat / 100 * this.calculatedData['total'];
    this.calculatedData['fairVat'] = this.vat / 100 * this.calculatedData['fairTotal'];

    this.calculatedData['grandTotal'] = this.calculatedData['total'] + this.calculatedData['vat'];
    this.calculatedData['grandTotalWR'] = NumberToWords.toWords(this.calculatedData['grandTotal'].toFixed());
    this.calculatedData['fairGrandTotal'] = this.calculatedData['fairTotal'] + this.calculatedData['fairVat'];
    this.calculatedData['fairGrandTotalWR'] = NumberToWords.toWords(this.calculatedData['fairGrandTotal'].toFixed());


    this.calculatedData['hrSubTotal70'] = 0.70 * this.calculatedData['fairHrSubTotal'];
    this.calculatedData['total70'] = this.calculatedData['hrSubTotal70'] + this.calculatedData['fairMiscTotal'] + this.calculatedData['fairOrientationCost']
    this.calculatedData['vat70'] = this.vat / 100 * this.calculatedData['total70'];

    this.calculatedData['hrSubTotal30'] = 0.30 * this.calculatedData['fairHrSubTotal'];
    this.calculatedData['total30'] = this.calculatedData['hrSubTotal30'] + this.calculatedData['fairHrOverhead'];
    this.calculatedData['vat30'] = this.vat / 100 * this.calculatedData['total30'];

    this.calculatedData['firstPaymentTotal'] = this.calculatedData['total70'] + this.calculatedData['vat70'];
    this.calculatedData['firstPaymentTotalWR'] = NumberToWords.toWords(this.calculatedData['firstPaymentTotal']);

    this.calculatedData['secondPaymentTotal'] = this.calculatedData['total30'] + this.calculatedData['vat30'];
    this.calculatedData['secondPaymentTotalWR'] = NumberToWords.toWords(this.calculatedData['secondPaymentTotal']);

    this.calculatedData['paymentMadeTilldate'] = 'on development';
    this.calculatedData['paymentRemaining'] = 'on development';



    console.log(this.calculatedData)
  }
}
