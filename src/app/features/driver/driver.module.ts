import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { DriverDashboardComponent } from './components/dashboard/driver-dashboard.component';
import { AvailableJobsComponent } from './components/available-jobs/available-jobs.component';
import { MyJobsComponent } from './components/my-jobs/my-jobs.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { DriverProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDashboardComponent,
    children: [
      {
        path: 'available-jobs',
        component: AvailableJobsComponent
      },
      {
        path: 'my-jobs',
        component: MyJobsComponent
      },
      {
        path: 'jobs/:id',
        component: JobDetailsComponent
      },
      {
        path: 'earnings',
        component: EarningsComponent
      },
      {
        path: 'profile',
        component: DriverProfileComponent
      },
      {
        path: '',
        redirectTo: 'available-jobs',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    DriverDashboardComponent,
    AvailableJobsComponent,
    MyJobsComponent,
    JobDetailsComponent,
    EarningsComponent,
    DriverProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DriverModule { }