// Spanish language strings for AfinarteStudio
export const STRINGS = {
  // Common objects used across multiple components
  shared: {
    // App info
    appName: 'AfinarteStudio',
    tagline: 'Estudio de Grabación & Clases de Música Profesional',
    since: 'Creando experiencias musicales excepcionales desde 2020',
    emailFull: 'juan.calderon@afinartestudio.com',
    emailDisplay: '@afinartestudio.com',
    phone: '+52 999 497 6090',
    address: 'Calle 17 #160 x 30 y 32, Col. García Ginerés, Mérida, Yucatán',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    required: 'requerido',
    optional: 'opcional',
    backToHome: 'Volver al Inicio',
    
    // Services
    services: {
      musicClasses: {
        title: 'Clases de Música',
        description: 'Clases profesionales de batería, piano y guitarra con instructores experimentados.'
      },
      pianoTuning: {
        title: 'Afinación de Pianos',
        description: 'Servicio profesional de afinación para pianos verticales con técnicas especializadas.'
      },
      recording: {
        title: 'Estudio de Grabación',
        description: 'Graba tu canción profesionalmente y súbela a Spotify con nuestra ayuda completa.'
      },
      pianoLessons: 'Clases de Piano',
      guitarLessons: 'Clases de Guitarra',
      drumsClasses: 'Clases de Batería',
      pianoTuningService: 'Afinación de Pianos',
      musicProduction: 'Producción Musical',
      other: 'Otros'
    },
    
    // Validation messages
    validation: {
      emailRequired: 'El correo electrónico es requerido',
      emailInvalid: 'Ingresa un correo electrónico válido',
      passwordRequired: 'La contraseña es requerida',
      nameRequired: 'El nombre es requerido',
      phoneRequired: 'El teléfono es requerido',
      serviceRequired: 'Selecciona un servicio',
      required: 'Campo requerido'
    },
    
    // Placeholders
    placeholders: {
      email: 'Ingresa tu correo electrónico',
      name: 'Ingresa tu nombre',
      phone: 'Ingresa tu teléfono',
      message: 'Cuéntanos detalles adicionales sobre tu proyecto...'
    }
  },

  // Navigation
  navigation: {
    home: 'Inicio',
    scheduler: 'Agenda',
    contact: 'Contacto',
    login: 'Inicio de Sesión',
    logout: 'Cerrar Sesión'
  },

  // Home page
  home: {
    welcome: 'AfinarteStudio',
    scheduleButton: 'Agenda',
    contactButton: 'Contacto',
    servicesTitle: 'Nuestros Servicios',
    getInTouch: 'Contáctanos'
    // services se obtienen de shared.services
  },

  // Contact page
  contact: {
    title: 'Contáctanos',
    subtitle: 'Ponte en contacto para hablar sobre tu próximo proyecto musical',
    phone: {
      title: 'Teléfono',
      description: 'Llámanos directamente para consultas inmediatas',
      number: '+52 999 497 6090'
    },
    email: {
      title: 'Correo Electrónico',
      description: 'Envíanos un correo con tus dudas o comentarios',
      addressFull: 'juan.calderon@afinartestudio.com',
      addressDisplay: '@afinartestudio.com'
    },
    location: {
      title: 'Ubicación',
      description: 'Nuestro estudio está disponible con cita previa',
      address: 'Calle 47 #158 x 16B y 16C, Floresta Residencial, Mérida, Yucatán',
      coordinates: {
        lat: 21.0182999,
        lng: -89.5490533
      },
      googleMapsUrl: 'https://maps.app.goo.gl/cGgGTRmYuc3R11pv6'
    },
    schedule: {
      title: 'Horarios',
      description: 'Nuestros horarios de atención y disponibilidad',
      hours: 'Lun-Vie: 9:00 AM - 10:00 PM, Sáb: 10:00 AM - 8:00 PM'
    },
    scheduleButton: 'Agendar Cita',
    sendMessage: 'Envíanos un mensaje',
    contactInfo: 'Información de Contacto',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    phoneNumber: 'Número de Teléfono',
    service: 'Servicio',
    message: 'Cuéntanos sobre tu proyecto',
    messagePlaceholder: 'Describe tu proyecto musical, objetivos, cronograma y cualquier requerimiento específico',
    sendButton: 'Enviar Mensaje'
    // placeholders y services se obtienen de shared
  },

  // Scheduler page
  scheduler: {
    title: 'Agendar una Cita',
    subtitle: 'Reserva tu sesión de música o grabación',
    service: 'Servicio',
    date: 'Fecha',
    time: 'Hora',
    name: 'Nombre Completo',
    email: 'Correo Electrónico',
    message: 'Mensaje (Opcional)',
    scheduleButton: 'Agendar Cita',
    placeholders: {
      service: 'Selecciona un servicio...',
      time: 'Selecciona una hora...',
      name: 'Ingresa tu nombre completo'
      // email y message se obtienen de shared.placeholders
    },
    validation: {
      dateRequired: 'Selecciona una fecha',
      timeRequired: 'Selecciona una hora'
      // otras validations se obtienen de shared.validation
    },
    selectService: 'Selecciona tu Servicio',
    selectButton: 'Seleccionar',
    contactFirst: '¿Necesitas más información antes de agendar?',
    contactButton: 'Contáctanos Primero',
    loginRequired: 'Debes iniciar sesión para agendar una cita',
    loginButton: 'Iniciar Sesión'
    // services se obtienen de shared.services
  },

  // Login page
  login: {
    title: 'AfinarteStudio',
    subtitle: 'Inicia sesión para acceder a tu cuenta',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    loginButton: 'Iniciar Sesión',
    loggingIn: 'Iniciando sesión...',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear Cuenta',
    placeholders: {
      password: 'Ingresa tu contraseña'
      // email se obtiene de shared.placeholders
    },
    validation: {
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres'
      // emailRequired, emailInvalid, passwordRequired se obtienen de shared.validation
    },
    messages: {
      invalidCredentials: 'Credenciales incorrectas. Intenta de nuevo.',
      loginSuccess: '¡Inicio de sesión exitoso! Redirigiendo...',
      welcomeJuan: '¡Bienvenido Juan! Redirigiendo...'
    },
    modals: {
      forgotPassword: 'Funcionalidad de recuperación de contraseña en desarrollo.\n\nCredenciales de prueba:\n• admin@afinartestudio.com / admin123\n• juan.calderon@afinartestudio.com / juan123',
      register: 'Funcionalidad de registro en desarrollo.\n\nPor ahora, contacta al administrador para crear una cuenta.'
    }
  },

  // Register page
  register: {
    title: 'Crear Cuenta en AfinarteStudio',
    subtitle: 'Únete para poder agendar tus citas musicales',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    terms: 'Acepto los términos y condiciones',
    registerButton: 'Crear Cuenta',
    registering: 'Creando cuenta...',
    hasAccount: '¿Ya tienes una cuenta?',
    loginLink: 'Inicia Sesión',
    placeholders: {
      firstName: 'Ingresa tu nombre',
      lastName: 'Ingresa tu apellido',
      password: 'Crea una contraseña segura',
      confirmPassword: 'Confirma tu contraseña'
      // email, phone se obtienen de shared.placeholders
    },
    validation: {
      firstNameRequired: 'El nombre es requerido',
      lastNameRequired: 'El apellido es requerido',
      passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
      confirmPasswordRequired: 'Confirma tu contraseña',
      passwordMismatch: 'Las contraseñas no coinciden',
      termsRequired: 'Debes aceptar los términos y condiciones'
      // emailRequired, emailInvalid, phoneRequired se obtienen de shared.validation
    },
    messages: {
      emailExists: 'Este correo ya está registrado. Intenta con otro.',
      registerSuccess: '¡Cuenta creada exitosamente! Redirigiendo...',
      serverError: 'Error del servidor. Intenta de nuevo más tarde.'
    }
  }
};
