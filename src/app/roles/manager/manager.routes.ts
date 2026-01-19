import { Routes } from '@angular/router';
<<<<<<< HEAD
import { managerGuard } from '../../core/guards/manager.guard';
=======
import { managerGuard } from '../../core/guards/index';
>>>>>>> ae1469b0901dd928681cd2aebb5d538c1d26ebd9

export const MANAGER_ROUTES: Routes = [
    {
        path: 'task-management',
        loadComponent: () => import('./task-management/task-management.component')
            .then(m => m.TaskManagementComponent),
        canActivate: [managerGuard]
    },
    {
        path: 'team-logs',
        loadComponent: () => import('./team-logs/team-logs.component')
            .then(m => m.TeamLogsComponent),
        canActivate: [managerGuard]
    },
    {
        path: 'team-analytics',
        loadComponent: () => import('./team-analytics/team-analytics.component')
            .then(m => m.TeamAnalyticsComponent),
        canActivate: [managerGuard]
    },
    { path: '', redirectTo: 'task-management', pathMatch: 'full' }
];
