import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { STRINGS } from '../shared/strings';

@Component({
  selector: 'app-scheduler',
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduler.html',
  styleUrl: './scheduler.css'
})
export class Scheduler {
  strings = STRINGS.scheduler;
  sharedStrings = STRINGS.shared;

  schedulerData = {
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    message: ''
  };

  isLoading = false;
  minDate: string;

  constructor(private router: Router) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.isValidForm()) {
      this.isLoading = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isLoading = false;
        alert('Cita agendada exitosamente. Te contactaremos pronto para confirmar.');
        this.resetForm();
      }, 2000);
    }
  }

  private isValidForm(): boolean {
    return !!(
      this.schedulerData.service.trim() &&
      this.schedulerData.date.trim() &&
      this.schedulerData.time.trim() &&
      this.schedulerData.name.trim() &&
      this.schedulerData.email.trim()
    );
  }

  private resetForm() {
    this.schedulerData = {
      service: '',
      date: '',
      time: '',
      name: '',
      email: '',
      message: ''
    };
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
