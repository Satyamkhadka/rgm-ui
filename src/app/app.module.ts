import { PmComponent } from './pm/pm.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxNepaliNumberToWordsModule } from 'ngx-nepali-number-to-words';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MyInterceptor } from './_interceptor/token.interceptor';
import { SoComponent } from './so/so.component';
import { SchemeComponent } from './scheme/scheme.component';
import { LocalBodyComponent } from './local-body/local-body.component';
import { PersonComponent } from './person/person.component';
import { StaffComponent } from './staff/staff.component';
import { PositionComponent } from './position/position.component';
import { BatchComponent } from './batch/batch.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AllcontractComponent } from './allcontract/allcontract.component';
import { MiscComponent } from './misc/misc.component';
import { CostBreakdownComponent } from './cost-breakdown/cost-breakdown.component';
import { MenuComponent } from './menu/menu.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { PaymentComponent } from './payment/payment.component';
import { AllmemoComponent } from './allmemo/allmemo.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    LoginComponent,
    ContractComponent,
    SuperadminComponent,
    AdminComponent,
    SoComponent,
    SchemeComponent,
    LocalBodyComponent,
    PersonComponent,
    StaffComponent,
    PositionComponent,
    BatchComponent,
    PmComponent,
    SidebarComponent,
    AllcontractComponent,
    MiscComponent,
    CostBreakdownComponent,
    MenuComponent,
    MemorandumComponent,
    PaymentComponent,
    AllmemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FilterPipeModule,
    NgxNepaliNumberToWordsModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
