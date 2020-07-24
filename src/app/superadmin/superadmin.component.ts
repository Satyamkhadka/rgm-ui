import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_userServices/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { PmService } from '../pm/_service/pm.service';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {

  users = [];
  userForm: FormGroup;
  allPm = [];
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private pmService: PmService
  ) {
    this.userForm = this.formBuilder.group({
      userName: '',
      password: '',
      password2: '',
      role: ''
    });
    if (this.authorized()) {
      this.getAllUser();

    } else {
      this.router.navigate(['/menu']);
    }

  }

  ngOnInit() {
  }
  getAllUser() {
    this.userService.getAllUsers().subscribe(data => {
      if (data['success'] === true) {
        this.users = data['data'];
      }
    });
  }

  createUser(data) {
    if (data.password === data.password2) {
      delete data.password2;
      const md5 = new Md5();
      data.password = md5.appendStr(data.password).end();
      data['active'] = '1';
      data['createdOn'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
      console.log(data)
      this.userService.createUser(data).subscribe(data => {
        if (data['success'] === true) {
          this.getAllUser();
          this.userForm.reset();
          swal.fire('Success', data['message'], 'success');
        } else {
          swal.fire('Oops', data['message'], 'error');
        }
      })
    } else {
      swal.fire('Wait', ' passwords do not match', 'warning');
    }
  }

  deleteUser(userId, role) {
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


        this.userService.deleteUser({ userId, role }).subscribe(cb => {
          if (cb['success'] === true) {
            this.getAllUser();
            swal.fire('Success', cb['message'], 'success');
          } else if (cb['success'] === false) {
            swal.fire('oops', cb['message'], 'error');
          }
        });


      }
    })




  }


  getAllPm() {
    this.pmService.getProjectManagers().subscribe(data => {
      if (data['success'] === true) {
        console.log(data);
        this.allPm = data['data'];
      }
    });
  }

  authorized() {

    let token = localStorage.getItem('LoggedInUser');
    token = jwt_decode(token);
    console.log(token)
    if (token['role'] === 'superadmin') {
      return true;
    } else return false;

  }

  change(value) {
    this.userForm.controls['userName'].setValue(value);
  }
}
