import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { CustomerDashboardComponent } from './components/dashboard/customer-dashboard.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
    children: [
      {
        path: 'create-request',
        component: CreateRequestComponent
      },
      {
        path: '',
        redirectTo: 'requests',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    CustomerDashboardComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CustomerModule { }