import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { SchedulerComponent } from './components/scheduler/scheduler';

export const routes: Routes = [
    { path: 'login', component: UserComponent },
    { path: 'scheduler', component: SchedulerComponent },

];
