import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SchedulerComponent } from './components/scheduler/scheduler';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'scheduler', component: SchedulerComponent },

];
