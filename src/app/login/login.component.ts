import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  
  constructor(
    private formBuilder:FormBuilder,
    private loginService:LoginService,
    private router: Router,
    private auth: AuthService
    ) {
    this.loginForm = this.formBuilder.group({
      userName:'',
      password: ''
    });
   }

  ngOnInit() {
  }

  signIn(formData){
    const md5 = new Md5();
    formData.password = md5.appendStr(formData.password).end();
    this.loginService.getSignInCredentials(formData).subscribe((data)=>{
      console.log(data);
      if(data['success'] === false){
        swal.fire('Oops','Wrong Credentials','error');
      }
      else{
        const userData = this.getDecodedAccessToken(data['token']);
        this.auth.sendToken(data['token']);
        if(userData===null){ swal.fire('Oops','Illegal actions','error')} else {
          if(userData['role']==='superadmin'){
            this.router.navigate(['/superadmin']);
          } else if (userData['role']==='admin'){
            this.router.navigate(['/admin']);

          } else if (userData['role']==='user'){
            this.router.navigate(['/']);

          }
        }

      }
    })
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
}
