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
import { PersonComponent } from './person/person.component';
import { StaffComponent } from './staff/staff.component';
import { PositionComponent } from './position/position.component';
import { BatchComponent } from './batch/batch.component';


const routes: Routes = [
  { path: '', component: InputComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contract', component: ContractComponent},
  { path: 'superadmin', component: SuperadminComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'so', component: SoComponent },
  { path: 'scheme', component: SchemeComponent },
  { path: 'local-body', component: LocalBodyComponent },
  { path: 'person', component: PersonComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'position', component: PositionComponent },
  { path: 'batch', component: BatchComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
