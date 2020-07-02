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
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private paymentService: PaymentService) { }

  ngOnInit() {

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

    });
  }

  onSubmit(formData) {
    console.log(formData)
    let plusData = formData;
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
}
