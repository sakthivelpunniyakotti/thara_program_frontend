import { Routes } from '@angular/router';

export const routes: Routes = [
    {

        path:'',
        loadComponent: () => import ('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import ('./pages/dashboard/dashboard.component').then((m)=>m.DashboardComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import ('./pages/admin-master/admin-master.component').then((m)=>m.AdminMasterComponent)
    },
    {
        path: 'dev',
        loadComponent: () => import ('./pages/dev/dev.component').then((m)=>m.DevComponent)
    },
    {
        path: 'student-master',
        loadComponent: () => import ('./pages/student-master/student-master.component').then((m)=>m.StudentMasterComponent)
    },
    {
        path: 'workboard',
        loadComponent: () => import ('./pages/workboard/workboard.component').then((m)=>m.WorkboardComponent)
    },
    {
        path: 'task-manager',
        loadComponent: () => import('./pages/task-manager/task-manager.component').then((m)=>m.TaskManagerComponent)
    },
    {
        path: 'config',
        loadComponent: () => import('./pages/config/config.component').then((m)=>m.ConfigComponent)
    }
];
