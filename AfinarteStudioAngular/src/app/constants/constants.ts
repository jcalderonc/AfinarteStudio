export const APPOINTMENT_TYPES = [
  'Afinacion de piano', 
  'Clase de guitarra', 
  'Clase de piano', 
  'Clase de batería',
  'Clase de bajo',
] as const;

export type AppointmentType = typeof APPOINTMENT_TYPES[number];
