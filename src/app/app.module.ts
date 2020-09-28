import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxNepaliNumberToWordsModule } from 'ngx-nepali-number-to-words';
import { NgxNepaliUnicodeModule } from 'ngx-nepali-unicode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './_guards/auth/auth.guard';
import { AuthService } from './_guards/auth.service';
import { MyInterceptor } from './_interceptor/token.interceptor';
import { SoComponent } from './so/so.component';
import { SchemeComponent } from './scheme/scheme.component';
import { LocalBodyComponent } from './local-body/local-body.component';
import { PersonComponent } from './person/person.component';
import { StaffComponent } from './staff/staff.component';
import { BatchComponent } from './batch/batch.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AllcontractComponent } from './allcontract/allcontract.component';
import { MiscComponent } from './misc/misc.component';
import { CostBreakdownComponent } from './cost-breakdown/cost-breakdown.component';
import { MenuComponent } from './menu/menu.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { PaymentComponent } from './payment/payment.component';
import { AllmemoComponent } from './allmemo/allmemo.component';
import { RwssStaffComponent } from './rwss-staff/rwss-staff.component';

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
    BatchComponent,
    SidebarComponent,
    AllcontractComponent,
    MiscComponent,
    CostBreakdownComponent,
    MenuComponent,
    MemorandumComponent,
    PaymentComponent,
    AllmemoComponent,
    RwssStaffComponent
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
    NgxNepaliUnicodeModule.forRoot(),
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
