import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APPOINTMENT_TYPES } from '../../constants/constants';
import { MexicoDatePipe } from '../../pipes/mexico-date-pipe';


@Component({
  selector: 'app-appointment',
  imports: [
    CommonModule,
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MexicoDatePipe
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class AppointmentComponent {
  appointmentForm: FormGroup;
  appointmentTypes = APPOINTMENT_TYPES;
  
  constructor(
    public dialogRef: MatDialogRef<AppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate?: Date, userEmail?: string },
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      email: [this.data.userEmail, [Validators.required, Validators.email]],
      date: [this.data.selectedDate, Validators.required],
      type: ['', Validators.required],
      comments: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.appointmentForm.valid) {
      const appointmentData = {
        email: this.appointmentForm.value.email,
        date: this.appointmentForm.value.date,
        type: this.appointmentForm.value.type,
        comments: this.appointmentForm.value.comments
      };
      this.dialogRef.close(appointmentData);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
}
