import { data } from './../../environments/data';
import { PaymentService } from './../payment/_service/payment.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-allmemo',
  templateUrl: './allmemo.component.html',
  styleUrls: ['./allmemo.component.css']
})
export class AllmemoComponent implements OnInit {

  phase = '';
  allmemo = [];
  memoForm: FormGroup;
  editMemo;
  filter: any = { so: '' }
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService

  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.phase = params.get("phase");
      if (this.phase) {
        this.paymentService.getAllPayment(this.phase).subscribe(data => {
          console.log(data)
          if (data['success']) {
            this.allmemo = data['data'];
          }
        })
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

  setEdit(memo) {
    this.editMemo = memo;
    this.memoForm = this.formBuilder.group({
      batch: this.editMemo.batch,
      date: this.editMemo.date,
      staffIdFrom: this.editMemo.staffIdFrom,
      staffIdThrough: this.editMemo.staffIdThrough,
      staffIdTo: this.editMemo.staffIdTo,
      so: this.editMemo.so,
      requestLetter: this.editMemo.requestLetter,
      consentLetter: this.editMemo.consentLetter,
      survey: this.editMemo.survey,
      bankAccount: this.editMemo.bankAccount,
      staffs: this.editMemo.staffs,

    });
  }
  onUpdate(formData) {
    console.log(formData)
    let plusData = formData;
    plusData['active'] = 1;
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
