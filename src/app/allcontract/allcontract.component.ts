import swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LocalBodyService } from './../local-body/_service/local-body.service';
import jwt_decode from 'jwt-decode';
import { ContractService } from '../input/_service/contract.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-allcontract',
  templateUrl: './allcontract.component.html',
  styleUrls: ['./allcontract.component.css']
})
export class AllcontractComponent implements OnInit {


  allContract = [];
  filter: any = { name: '' }
  constructor(
    private localService: LocalBodyService,
    private contractService: ContractService,
    private formBuilder: FormBuilder
  ) {
    this.populateList();

  }

  ngOnInit() {
  }

  populateList() {
    this.allContract = [];
    this.contractService.getAllContract().subscribe(data => {
      if (data['success'] === true) {
        console.log('called')
        this.allContract = data['data'];
        console.log(data)
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

  deleteContract(contractId) {
    this.contractService.deleteContract(contractId).subscribe(data => {
      if (data['success']) {
        this.populateList();
        Swal.fire('Success', 'Deleted Successfully', 'info');
      } else {
        Swal.fire('Error', data['message'], 'error')
      }
    })
  }

}
