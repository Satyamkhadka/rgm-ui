import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import { LoginComponent } from './login/login.component';
import { ContractComponent } from './contract/contract.component';


const routes: Routes = [
  { path: '', component: InputComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contract', component: ContractComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
