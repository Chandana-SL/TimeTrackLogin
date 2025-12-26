import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './roles/auth/home/home.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from './roles/auth/home/signup/signup.component';
<<<<<<< HEAD
import { SigninComponent } from './roles/auth/home/signin/signin.component';
import { DashboardComponent } from './roles/admin/dashboard/dashboard.component';
import { DashboardemployeeComponent } from './roles/employee/dashboardemployee/dashboardemployee.component';
=======
import { ManagerComponent } from './roles/manager/manager.component';
>>>>>>> c8f2e7ad789f13865c191f0d4f5c3c490ec2e450

export const routes: Routes = [
    { path: '',component:HomeComponent},
    { path:'signup', component:SignupComponent},
<<<<<<< HEAD
    {path:'signin', component:SigninComponent},
    { path: 'admin/dashboard', component: DashboardComponent }, 

  { path: 'employee/dashboardemployee', component: DashboardemployeeComponent },
=======
    { path:'manager', component:ManagerComponent}
>>>>>>> c8f2e7ad789f13865c191f0d4f5c3c490ec2e450
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}
