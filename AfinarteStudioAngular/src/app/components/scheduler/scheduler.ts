import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { ASCalendarModule } from '../../modules/calendar/calendar-module';
import { addHours, startOfWeek } from 'date-fns';
import { Snackbar } from '../../services/snackbar';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-scheduler',
  imports: [
    CommonModule,
    ASCalendarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],

  templateUrl: './scheduler.html',
  styleUrl: './scheduler.css'
})

export class SchedulerComponent implements OnInit {
  
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackbar: Snackbar
  ) {}

  viewDate: Date = new Date();

  view: CalendarView = CalendarView.Month;

  events: CalendarEvent[] = [
    {
      start: addHours(startOfWeek(new Date()), 10),
      end: addHours(startOfWeek(new Date()), 11),
      title: 'Cita ocupada',
      color: { primary: '#ad2121', secondary: '#FAE3E3' }
    }
    // ...más eventos
  ];

  handleHourClick(event: any) {
    this.snackbar.showInfo(`Hora seleccionada: ${event.date}`, 'Cerrar');
    // Aquí puedes abrir un modal para agendar una cita
  }

  ngOnInit(): void {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      console.log('Usuario autenticado:', this.loginService.userSignedIn());
    }
  }
  

  onViewDateChange() {
    this.snackbar.showInfo(`Fecha de vista cambiada: ${this.viewDate}`, 'Cerrar');
  }
}
