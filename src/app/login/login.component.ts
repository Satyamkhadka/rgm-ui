import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import { AuthService } from '../_guards/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  disableButton = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      userName: '',
      password: ''
    });
  }

  ngOnInit() {
  }

  signIn(formData) {
    this.disableButton = true;

    console.log(formData)
    const md5 = new Md5();
    if (formData.userName === null || formData.password === null) { swal.fire('Oops', 'Illegal actions', 'error'); this.disableButton = false; return }
    formData.password = md5.appendStr(formData.password).end();
    this.loginService.getSignInCredentials(formData).subscribe((data) => {
      console.log(data);
      if (data['success'] === false) {
        this.loginForm.reset();
        this.disableButton = false;
        swal.fire('Oops', 'Wrong Credentials', 'error');
      }
      else {
        const userData = this.getDecodedAccessToken(data['token']);
        this.auth.sendToken(data['token']);
        this.disableButton = false;
        if (userData.userName === null || userData.password === null) { swal.fire('Oops', 'Illegal actions', 'error'); this.disableButton = false; } else {
          if (userData['role'] === 'superadmin') {
            this.router.navigate(['/menu']);
          } else if (userData['role'] === 'admin') {
            this.router.navigate(['/menu']);

          } else if (userData['role'] === 'user') {
            this.router.navigate(['/menu']);

          }
        }

      }
    })
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
