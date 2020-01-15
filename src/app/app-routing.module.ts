import { SchemeComponent } from './scheme/scheme.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { SoComponent } from './so/so.component';
import { LocalBodyComponent } from './local-body/local-body.component';
import { StaffComponent } from './staff/staff.component';


const routes: Routes = [
  { path: '', component: InputComponent  ,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'contract', component: ContractComponent ,canActivate: [AuthGuard] },
  { path: 'superadmin', component: SuperadminComponent,canActivate: [AuthGuard]  },
  { path: 'admin', component: AdminComponent ,canActivate: [AuthGuard] },
  { path: 'so', component: SoComponent },
  { path: 'scheme', component: SchemeComponent },
  { path: 'local-body', component: LocalBodyComponent },
  { path: 'staff', component: StaffComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
