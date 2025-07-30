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
import { MatDialog } from '@angular/material/dialog';
import { AppointmentComponent } from '../appointment/appointment';

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
    private snackbar: Snackbar,
    private dialog: MatDialog
  ) {}

  viewDate: Date = new Date();

  view: CalendarView = CalendarView.Month;

  events: CalendarEvent[] = [
    {
      start: addHours(startOfWeek(new Date()), 10),
      end: addHours(startOfWeek(new Date()), 11),
      title: 'Cita ocupada',
      color: { primary: '#a0c182ff', secondary: '#739d00ff' }
    }
    // ...más eventos
  ];

  handleHourClick(event: any) {
    this.openAppointmentDialog(event.date);
  }

  openAppointmentDialog(selectedDate?: Date) {
    const userEmail = this.loginService.userSignedIn()?.email || '';
    
    const dialogRef = this.dialog.open(AppointmentComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      data: { 
        selectedDate: selectedDate,
        userEmail: userEmail
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Cita creada:', result);
        // Aquí puedes agregar la lógica para guardar la cita
      }
    });
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
