import { Routes } from '@angular/router';
<<<<<<< HEAD
import { employeeGuard } from '../../core/guards/employee.guard';
=======
import { employeeGuard } from '../../core/guards/index';
>>>>>>> ae1469b0901dd928681cd2aebb5d538c1d26ebd9
export const EMPLOYEE_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboardemployee/dashboardemployee.component')
            .then(m => m.DashboardemployeeComponent), // Changed from EmployeeDashboardComponent
        canActivate: [employeeGuard]
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];