import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
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
    private contractService: ContractService,
  ) {

  }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    this.allContract = [];
    this.contractService.getAllContract().subscribe(data => {
      if (data['success'] === true) {
        console.log('getting all the ocntractsss righ now ')
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
