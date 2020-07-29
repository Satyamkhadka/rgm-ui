import { RwssStaffService } from './../rwss-staff/_service/rwss-staff.service';
import { BatchService } from './../batch/_service/batch.service';
import { SoService } from './../so/_service/so.service';
import { PaymentService } from './_service/payment.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public memoForm: FormGroup;
  phase;
  allStaffs = [];
  allSo = [];
  allBatches = [];
  contractId;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private rwssStaffService: RwssStaffService,
    private soService: SoService,
    private batchService: BatchService
  ) { }

  ngOnInit() {

    this.getAllSo();
    this.getAllStaffs();
    this.getAllBatches();
    this.route.paramMap.subscribe(params => {
      this.phase = params.get("phase");
      if (this.phase) {
        // this.getContractById(this.contractId);

        console.log(this.phase)
      }
    });


    this.memoForm = this.formBuilder.group({
      batch: ['', Validators.required],
      date: ['', Validators.required],
      staffIdFrom: ['', Validators.required],
      staffIdThrough: ['', Validators.required],
      staffIdTo: ['', Validators.required],
      so: ['', Validators.required],
      requestLetter: ['', Validators.required],
      consentLetter: ['', Validators.required],
      survey: ['', Validators.required],
      bankAccount: ['', Validators.required],
      staffs: ['', Validators.required],
      firstAmendment: 0,
      secondAmendment: 0,

    });
  }

  onSubmit(formData) {
    if (!this.contractId) {
      swal.fire('oops', 'No contract for provided batch and SO found!', 'warning');
      return;
    }
    console.log(formData)
    let plusData = formData;
    plusData['contractId'] = this.contractId;
    plusData['active'] = 1;
    plusData['phase'] = this.phase;
    plusData['createdOn'] = new Date();
    plusData['createdBy'] = this.getDecodedAccessToken(localStorage.getItem('LoggedInUser')).userId;

    if (this.memoForm.valid) {

      this.paymentService.createPayment(plusData).subscribe(data => {
        if (data['success']) {
          this.memoForm.reset();
          swal.fire('Success', 'sucessfully created payment memo');
        } else {
          swal.fire('Oops', data['message'], 'error');

        }
      })


    } else {
      swal.fire('Oops', 'some fields were empty. ', 'warning');
    }
  }


  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
  getAllStaffs() {

    this.rwssStaffService.getAllStaff().subscribe(data => {
      if (data['success'] === true) {
        this.allStaffs = data['data'];
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

  getAllBatches() {
    this.batchService.getAllBatch().subscribe(data => {
      if (data['success'] === true) {
        this.allBatches = data['data'];
      }
    });
  }

  getContractByBatchAndSo(formData) {
    this.contractId = null;
    if (formData.batch && formData.so) {
      console.log('changes on the coontract pary ')
      this.paymentService.getContractByBatchAndSo(formData.batch, formData.so).subscribe(data => {
        console.log(data);
        if (data['data'].length > 0) {
          this.contractId = data['data'][0]['contractId'];
        }
      })
    }
  }

}
