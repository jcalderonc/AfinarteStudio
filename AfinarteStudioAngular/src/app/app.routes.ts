import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { SchedulerComponent } from './components/scheduler/scheduler';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
    { path: 'login', component: UserComponent },
    { path: 'scheduler', component: SchedulerComponent },
    { path: '', component: HomeComponent }
];
