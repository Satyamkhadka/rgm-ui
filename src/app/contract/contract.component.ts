import { LocalBodyService } from './../local-body/_service/local-body.service';
import { ContractService } from './../input/_service/contract.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import NepaliDate from 'nepali-date/cjs';
import NumberToWords from 'number-to-words';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  contractId;
  contractDetails = {};
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
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get("contractId");
      if (this.contractId) {
        this.getContractById(this.contractId);
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

        this.getDistrictById(this.contractDetails['districtId']);
        this.getLocalBodyById(this.contractDetails['localBodyId']);
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


  getDistrictById(districtId) {
    this.localBodyService.getDistrictById(districtId).subscribe(data => { //get staff under so
      if (data['success'] === true) {
        this.district = data['data'][0]['nameNP'];
      }
    });
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
    this.staff.forEach(e => {
      this.calculatedData[e.name] = {};
      this.calculatedData[e.name]['fairPay'] = ((e['monthlyPay'] / 30) * e['workingDays']) * this.numberOfSchemes;
      this.calculatedData[e.name]['person'] = e['person'];
      this.calculatedData[e.name]['workingDays'] = e['workingDays'] * this.numberOfSchemes;
      this.calculatedData['hrSubTotal'] += this.calculatedData[e.name]['fairPay'];
    })
    this.calculatedData['hrOverhead'] = this.overhead / 100 * this.calculatedData['hrSubTotal'];
    this.calculatedData['hrTotal'] = this.calculatedData['hrSubTotal'] + this.calculatedData['hrOverhead'];


    // misc part
    this.miscData['transportationCost'] = this.contractDetails['transportationCost'] * this.numberOfSchemes;
    this.miscData['communicationCost'] = this.contractDetails['communicationCost'] * this.numberOfSchemes;
    this.miscData['reportingCost'] = this.contractDetails['reportingCost'] * this.numberOfSchemes;
    this.miscData['jointMonitoringCost'] = this.contractDetails['jointMonitoringCost'] * this.numberOfSchemes;

    this.calculatedData['orientationCost'] = this.contractDetails['orientationCost'] * this.numberOfSchemes;
    this.calculatedData['miscTotal'] = 0;
    for (let item in this.miscData) {
      this.calculatedData[item] = this.miscData[item];
      this.calculatedData['miscTotal'] += this.miscData[item];
    }
    this.calculatedData['total'] = this.calculatedData['hrTotal'] + this.calculatedData['miscTotal'] + this.calculatedData['orientationCost'];
    this.calculatedData['vat'] = this.vat / 100 * this.calculatedData['total'];
    this.calculatedData['grandTotal'] = this.calculatedData['total'] + this.calculatedData['vat'];
    this.calculatedData['grandTotalWR'] = NumberToWords.toWords(this.calculatedData['grandTotal'].toFixed());

    this.calculatedData['hrSubTotal70'] = 0.70 * this.calculatedData['hrSubTotal'];
    this.calculatedData['hrSubTotal30'] = 0.30 * this.calculatedData['hrSubTotal'];

    console.log(this.calculatedData)
  }
}