import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: InputComponent  ,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'contract', component: ContractComponent ,canActivate: [AuthGuard] },
  { path: 'superadmin', component: SuperadminComponent,canActivate: [AuthGuard]  },
  { path: 'admin', component: AdminComponent ,canActivate: [AuthGuard] },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
