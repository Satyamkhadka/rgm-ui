import { UserGuard } from './_guards/user/user.guard';
import { AllmemoComponent } from './allmemo/allmemo.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { MenuComponent } from './menu/menu.component';
import { CostBreakdownComponent } from './cost-breakdown/cost-breakdown.component';
import { PmComponent } from './pm/pm.component';
import { SchemeComponent } from './scheme/scheme.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { SoComponent } from './so/so.component';
import { LocalBodyComponent } from './local-body/local-body.component';
import { PersonComponent } from './person/person.component';
import { StaffComponent } from './staff/staff.component';
import { BatchComponent } from './batch/batch.component';
import { AllcontractComponent } from './allcontract/allcontract.component';
import { MiscComponent } from './misc/misc.component';
import { PaymentComponent } from './payment/payment.component';
import { SuperadminGuard } from './_guards/superadmin/superadmin.guard';
import { AdminGuard } from './_guards/admin/admin.guard';
import { RwssStaffComponent } from './rwss-staff/rwss-staff.component';

const routes: Routes = [

  //public
  { path: 'login', component: LoginComponent },


  //user
  { path: '', canActivate: [UserGuard], component: InputComponent },
  { path: 'person', canActivate: [UserGuard], component: PersonComponent },
  { path: 'menu', canActivate: [UserGuard], component: MenuComponent },
  { path: 'staff', canActivate: [UserGuard], component: StaffComponent },
  //perso
  { path: 'so', canActivate: [UserGuard], component: SoComponent },  // [superadmin,admin] everything [user] only appointed so
  { path: 'scheme', canActivate: [UserGuard], component: SchemeComponent },
  { path: 'contract', canActivate: [UserGuard], component: AllcontractComponent },
  { path: 'contract/:contractId', canActivate: [UserGuard], component: ContractComponent },
  { path: 'contract/cost/:contractId', canActivate: [UserGuard], component: CostBreakdownComponent },
  { path: 'memo/:memoId', canActivate: [UserGuard], component: MemorandumComponent },
  { path: 'allmemo/:phase', canActivate: [UserGuard], component: AllmemoComponent },
  { path: 'payment/:phase', canActivate: [UserGuard], component: PaymentComponent },

  //admin
  { path: 'pm', canActivate: [AdminGuard], component: PmComponent },
  { path: 'batch', canActivate: [AdminGuard], component: BatchComponent },
  { path: 'misc', canActivate: [AdminGuard], component: MiscComponent },
  { path: 'rwss-staff', canActivate: [AdminGuard], component: RwssStaffComponent },


  //superadmin
  { path: 'superadmin', canActivate: [SuperadminGuard], component: SuperadminComponent }, //only superadmin
  { path: 'local-body', canActivate: [SuperadminGuard], component: LocalBodyComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
