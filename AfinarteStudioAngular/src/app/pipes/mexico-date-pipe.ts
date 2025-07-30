import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mexicoDate',
  standalone: true
})
export class MexicoDatePipe implements PipeTransform {

  transform(value: Date | string | null): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Mexico_City'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Mexico_City'
    };

    const datePart = date.toLocaleDateString('es-MX', dateOptions);
    const timePart = date.toLocaleTimeString('es-MX', timeOptions);

    // Capitalizar primera letra del día y mes
    const formattedDate = datePart.replace(/^\w/, c => c.toUpperCase())
      .replace(/ de (\w)/, (match, p1) => ` de ${p1.toUpperCase()}`);

    return `${formattedDate} a las ${timePart}`;
  }

}
