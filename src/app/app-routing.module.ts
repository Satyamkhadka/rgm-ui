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
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { SoComponent } from './so/so.component';
import { LocalBodyComponent } from './local-body/local-body.component';
import { PersonComponent } from './person/person.component';
import { StaffComponent } from './staff/staff.component';
import { PositionComponent } from './position/position.component';
import { BatchComponent } from './batch/batch.component';
import { AllcontractComponent } from './allcontract/allcontract.component';
import { MiscComponent } from './misc/misc.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: InputComponent },
  { path: 'login', component: LoginComponent },
  { path: 'superadmin', canActivate: [AuthGuard], component: SuperadminComponent },
  // { path: 'admin',canActivate: [AuthGuard], component: AdminComponent },
  { path: 'so', canActivate: [AuthGuard], component: SoComponent },
  { path: 'scheme', canActivate: [AuthGuard], component: SchemeComponent },
  { path: 'local-body', canActivate: [AuthGuard], component: LocalBodyComponent },
  { path: 'person', canActivate: [AuthGuard], component: PersonComponent },
  { path: 'staff', canActivate: [AuthGuard], component: StaffComponent },
  // { path: 'position',canActivate: [AuthGuard], component: PositionComponent },
  { path: 'batch', canActivate: [AuthGuard], component: BatchComponent },
  { path: 'pm', canActivate: [AuthGuard], component: PmComponent },
  { path: 'contract', canActivate: [AuthGuard], component: AllcontractComponent },
  { path: 'misc', canActivate: [AuthGuard], component: MiscComponent },
  { path: 'menu', canActivate: [AuthGuard], component: MenuComponent },
  { path: 'contract/:contractId', canActivate: [AuthGuard], component: ContractComponent },
  { path: 'contract/cost/:contractId', canActivate: [AuthGuard], component: CostBreakdownComponent },
  { path: 'memo/:memoId', canActivate: [AuthGuard], component: MemorandumComponent },
  { path: 'allmemo/:phase', canActivate: [AuthGuard], component: AllmemoComponent },
  { path: 'payment/:phase', canActivate: [AuthGuard], component: PaymentComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
