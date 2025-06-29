# Guía de Uso de Strings Compartidos

## Estructura Simplificada de STRINGS

El archivo `strings.ts` ha sido simplificado para evitar redundancia entre `common` y `shared`.

### Objetos Compartidos (STRINGS.shared)

Ahora `STRINGS.shared` contiene TODOS los elementos reutilizables:

#### Información de la App
- `appName` - "AfinarteStudio"
- `tagline` - "Estudio de Grabación & Clases de Música Profesional"
- `since` - "Creando experiencias musicales excepcionales desde 2020"
- `emailFull` - "juan.calderon@afinartestudio.com"
- `emailDisplay` - "@afinartestudio.com"
- `phone` - "+52 999 497 6090"
- `address` - Dirección completa
- `loading`, `error`, `success`, `required`, `optional`, `backToHome`

#### Servicios (shared.services)
- `musicClasses`, `pianoTuning`, `recording` (con title y description)
- `pianoLessons`, `guitarLessons`, `drumsClasses`, `pianoTuningService`, `musicProduction`, `other`

#### Validaciones (shared.validation)
- `emailRequired`, `emailInvalid`, `passwordRequired`, `nameRequired`, `phoneRequired`, `serviceRequired`, `required`

#### Placeholders (shared.placeholders)
- `email`, `name`, `phone`, `message`

## Cómo Usar en Componentes

### 1. Importar en el TypeScript (SIMPLIFICADO):
```typescript
import { STRINGS } from '../shared/strings';

export class MiComponente {
  strings = STRINGS.miSeccion;     // Strings específicos del componente
  sharedStrings = STRINGS.shared;  // TODOS los strings compartidos
}
```

### 2. Usar en el HTML:
```html
<!-- Para servicios -->
<h5>{{sharedStrings.services.musicClasses.title}}</h5>
<p>{{sharedStrings.services.musicClasses.description}}</p>

<!-- Para validaciones -->
<small>{{sharedStrings.validation.emailRequired}}</small>

<!-- Para placeholders -->
<input [placeholder]="sharedStrings.placeholders.email">
```

## Secciones Simplificadas

- **home**: Ya no tiene `services` (usar `shared.services`)
- **contact**: Ya no tiene `placeholders` ni `services` duplicados
- **scheduler**: Ya no tiene validaciones ni servicios duplicados
- **login**: Ya no tiene validaciones de email duplicadas
- **register**: Ya no tiene validaciones ni placeholders duplicados

## Beneficios

✅ **Menos duplicación**: Un solo lugar para servicios, validaciones y placeholders
✅ **Mantenimiento fácil**: Cambios en un solo lugar
✅ **Consistencia**: Mismos textos en toda la aplicación
✅ **Escalabilidad**: Fácil agregar nuevos elementos compartidos
