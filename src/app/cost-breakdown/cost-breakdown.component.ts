import { LocalBodyService } from './../local-body/_service/local-body.service';
import { ContractService } from './../input/_service/contract.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import NepaliDate from 'nepali-date/cjs';
import NumberToWords from 'number-to-words';
@Component({
  selector: 'app-cost-breakdown',
  templateUrl: './cost-breakdown.component.html',
  styleUrls: ['./cost-breakdown.component.css']
})
export class CostBreakdownComponent implements OnInit {

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

  hrListing = [];
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
    this.createdDate = new NepaliDate(this.contractDetails['createdOn']);
    this.createdDate = this.createdDate.format('yyyy-mmmm-dd , ddd');
    //hr part 
    this.calculatedData['hrSubTotal'] = 0;
    this.calculatedData['fairHrSubTotal'] = 0;
    this.staff.forEach(e => {
      this.calculatedData[e.name] = {};
      this.calculatedData[e.name]['monthlyPay'] = e['monthlyPay'];
      this.calculatedData[e.name]['fairMonthlyPay'] = +((e['monthlyPay'] / 30) * e['workingDays']).toFixed(2);
      this.calculatedData[e.name]['payable'] = +(((e['monthlyPay'] / 30) * e['workingDays']) * this.numberOfSchemes).toFixed(2);
      this.calculatedData[e.name]['person'] = e['person'];
      this.calculatedData[e.name]['workingDays'] = e['workingDays'];
      this.calculatedData[e.name]['fairWorkingDays'] = +(e['workingDays'] * this.numberOfSchemes).toFixed(2);
      //totals
      this.calculatedData['hrSubTotal'] += +(this.calculatedData[e.name]['fairMonthlyPay']).toFixed(2);
      this.calculatedData['fairHrSubTotal'] += +(this.calculatedData[e.name]['payable']).toFixed(2);
    });
    //overheads
    this.calculatedData['hrOverhead'] = +(this.overhead / 100 * this.calculatedData['hrSubTotal']).toFixed(2);
    this.calculatedData['hrTotal'] = +(this.calculatedData['hrSubTotal'] + this.calculatedData['hrOverhead']).toFixed(2);
    this.calculatedData['fairHrOverhead'] = +(this.overhead / 100 * this.calculatedData['fairHrSubTotal']).toFixed(2);
    this.calculatedData['fairHrTotal'] = +(this.calculatedData['fairHrSubTotal'] + this.calculatedData['fairHrOverhead']).toFixed(2);


    // misc part
    this.miscData['transportationCost'] = +(this.contractDetails['transportationCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['communicationCost'] = +(this.contractDetails['communicationCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['reportingCost'] = +(this.contractDetails['reportingCost'] * this.numberOfSchemes).toFixed(2);
    this.miscData['jointMonitoringCost'] = +(this.contractDetails['jointMonitoringCost'] * this.numberOfSchemes).toFixed(2);
    this.calculatedData['orientationCost'] = +(this.contractDetails['orientationCost']).toFixed(2);
    this.calculatedData['fairOrientationCost'] = +(this.contractDetails['orientationCost'] * this.numberOfSchemes).toFixed(2);

    this.calculatedData['miscTotal'] = 0;
    this.calculatedData['fairMiscTotal'] = 0;
    for (let item in this.miscData) {
      this.calculatedData[item] = this.miscData[item];
      this.calculatedData['fairMiscTotal'] += this.miscData[item];
      this.calculatedData['miscTotal'] += this.contractDetails[item];
    }

    this.calculatedData['total'] = +(this.calculatedData['hrTotal'] + this.calculatedData['miscTotal'] + this.calculatedData['orientationCost']).toFixed(2);
    this.calculatedData['fairTotal'] = +(this.calculatedData['fairHrTotal'] + this.calculatedData['fairMiscTotal'] + this.calculatedData['fairOrientationCost']).toFixed(2);

    this.calculatedData['vat'] = +(this.vat / 100 * this.calculatedData['total']).toFixed(2);
    this.calculatedData['fairVat'] = +(this.vat / 100 * this.calculatedData['fairTotal']).toFixed(2);

    this.calculatedData['grandTotal'] = +(this.calculatedData['total'] + this.calculatedData['vat']).toFixed(2);
    this.calculatedData['grandTotalWR'] = NumberToWords.toWords(this.calculatedData['grandTotal']);
    this.calculatedData['fairGrandTotal'] = +(this.calculatedData['fairTotal'] + this.calculatedData['fairVat']).toFixed(2);
    this.calculatedData['fairGrandTotalWR'] = NumberToWords.toWords(this.calculatedData['fairGrandTotal']);


    this.calculatedData['hrSubTotal70'] = +(0.70 * this.calculatedData['fairHrSubTotal']).toFixed(2);
    this.calculatedData['total70'] = + (this.calculatedData['hrSubTotal70'] + this.calculatedData['fairMiscTotal'] + this.calculatedData['fairOrientationCost']).toFixed(2);
    this.calculatedData['vat70'] = +(this.vat / 100 * this.calculatedData['total70']).toFixed(2);

    this.calculatedData['hrSubTotal30'] = +(0.30 * this.calculatedData['fairHrSubTotal']).toFixed(2);
    this.calculatedData['total30'] = +(this.calculatedData['hrSubTotal30'] + this.calculatedData['fairHrOverhead']).toFixed(2);
    this.calculatedData['vat30'] = +(this.vat / 100 * this.calculatedData['total30']).toFixed(2);

    this.calculatedData['firstPaymentTotal'] = +(this.calculatedData['total70'] + this.calculatedData['vat70']).toFixed(2);
    this.calculatedData['secondPaymentTotal'] = +(this.calculatedData['total30'] + this.calculatedData['vat30']).toFixed(2);


    console.log(this.calculatedData)
  }


}
