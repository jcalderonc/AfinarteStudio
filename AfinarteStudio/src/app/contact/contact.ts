import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { STRINGS } from '../shared/strings';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  strings = STRINGS.contact;
  sharedStrings = STRINGS.shared;

  constructor(private router: Router) {}

  contactData = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    if (this.isValidForm()) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulate form submission
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Mensaje enviado exitosamente. Te contactaremos pronto.';
        this.resetForm();
      }, 2000);
    }
  }

  private isValidForm(): boolean {
    return !!(
      this.contactData.name.trim() &&
      this.contactData.email.trim() &&
      this.contactData.service.trim() &&
      this.contactData.message.trim()
    );
  }

  private resetForm() {
    this.contactData = {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    };
  }

  goToScheduler() {
    this.router.navigate(['/scheduler']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
