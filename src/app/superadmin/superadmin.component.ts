import swal  from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_userServices/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {

  users = [];
  userForm:FormGroup;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.getAllUser();
    this.userForm = this.formBuilder.group({
      userName:'',
      password:'',
      password2:'',
      role:''
    });
   }

  ngOnInit() {
  }
  getAllUser(){
this.userService.getAllUsers().subscribe(data=>{
  this.users = data['data'];
});
  }

  createUser(data){
if(data.password===data.password2){
  delete data.password2;
  data['active']= 'active';
  this.userService.createUser(data).subscribe(data=>{
    if(data['success']===true){
      this.getAllUser();
      swal.fire('Success',data['message'],'success');
    } else {
      swal.fire('Oops',data['message'],'error');
    }
  })
} else {
  swal.fire('Wait', 'Re-entered password do not match', 'warning');
}
  }

  deleteUser(id){
    swal.fire('delete?','delete function is made '+id, 'info');
  }
}
