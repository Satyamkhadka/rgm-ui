import { data } from './../../environments/data';
import { PaymentService } from './../payment/_service/payment.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { BatchService } from '../batch/_service/batch.service';
import { SoService } from '../so/_service/so.service';
import { StaffService } from '../staff/_service/staff.service';

@Component({
  selector: 'app-allmemo',
  templateUrl: './allmemo.component.html',
  styleUrls: ['./allmemo.component.css']
})
export class AllmemoComponent implements OnInit {

  phase = '';
  allmemo = [];
  editMemo;
  filter: any = { so: '' };


  public memoForm: FormGroup;
  allStaffs = [];
  allSo = [];
  allBatches = [];
  contractId;


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private staffService: StaffService,
    private soService: SoService,
    private batchService: BatchService

  ) { }

  ngOnInit() {
    this.memoForm = this.formBuilder.group({
      memoId: [{ value: '', disabled: true }, Validators.required,],
      batch: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      staffIdFrom: ['', Validators.required],
      staffIdThrough: ['', Validators.required],
      staffIdTo: ['', Validators.required],
      so: [{ value: '', disabled: true }, Validators.required],
      requestLetter: ['', Validators.required],
      consentLetter: ['', Validators.required],
      survey: ['', Validators.required],
      bankAccount: ['', Validators.required],
      staffs: ['', Validators.required],

    });

    this.route.paramMap.subscribe(params => {
      this.phase = params.get("phase");
      if (this.phase) {
        this.diffrentialLoading()
      }
    });


  }

  diffrentialLoading() {
    this.paymentService.getAllPayment(this.phase).subscribe(data => {
      console.log(data)
      if (data['success']) {
        this.allmemo = data['data'];

        this.getAllSo();
        this.getAllStaffs();
        this.getAllBatches();



      }
    })
    console.log(this.phase)
  }

  setEdit(memo) {
    this.editMemo = memo;
    console.log(memo.batch)
    this.memoForm = this.formBuilder.group({
      memoId: this.editMemo.memoId,
      batch: { value: this.editMemo.batch, disabled: true },
      date: this.editMemo.date.slice(0, 10),
      staffIdFrom: this.editMemo.staffIdFrom,
      staffIdThrough: this.editMemo.staffIdThrough,
      staffIdTo: this.editMemo.staffIdTo,
      so: { value: this.editMemo.so, disabled: true },
      requestLetter: this.editMemo.requestLetter,
      consentLetter: this.editMemo.consentLetter,
      survey: this.editMemo.survey,
      bankAccount: this.editMemo.bankAccount,
      staffs: this.editMemo.staffs,

    });
  }
  onSubmit(formData) {
    let plusData = formData;
    delete plusData['batch'];
    delete plusData['so'];
    delete plusData['date'];

    if (this.memoForm.valid) {

      this.paymentService.updatePayment(plusData).subscribe(data => {
        if (data['success']) {
          this.paymentService.getAllPayment(this.phase).subscribe(data => {
            console.log(data)
            if (data['success']) {
              this.allmemo = data['data'];
            }
          })
          this.memoForm.reset();
          swal.fire('Success', 'sucessfully updated payment memo');
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

    this.staffService.getAllStaff().subscribe(data => {
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

  delete(memoId) {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this.paymentService.deletePayment(memoId).subscribe(data => {
          if (data['success'] === true) {
            swal.fire('Deleted', data['message'], 'info');
            this.diffrentialLoading();
          } else if (data['success'] === false) {
            swal.fire('oops', data['message'], 'error');
          }
        });


      }
    })
  }
}

