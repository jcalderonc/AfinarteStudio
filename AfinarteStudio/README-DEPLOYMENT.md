# Guía de Deployment para Netlify

## Problema Resuelto: Error "Page not found"

El error "Page not found" en Netlify ocurría porque la aplicación Angular es una SPA (Single Page Application) que usa client-side routing, pero Netlify no sabía cómo manejar las rutas directas.

## Archivos de Configuración Agregados

### 1. `public/_redirects`
```
/*    /index.html   200
```
Este archivo le dice a Netlify que redirija todas las rutas al `index.html` para que Angular pueda manejar el routing del lado del cliente.

### 2. `netlify.toml`
Configuración principal de Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist/AfinarteStudio/browser`
- **Redirects**: Configuración de SPA fallback
- **Headers**: Headers de seguridad y cache

## Cambios en Angular

### `angular.json`
- Cambiado `"outputMode": "server"` a `"outputMode": "static"`
- Removido la configuración SSR para generar archivos estáticos
- El output ahora va a `dist/AfinarteStudio/browser/`

## Instrucciones de Deployment

### 1. Commit y Push
```bash
git add .
git commit -m "Configure Netlify deployment"
git push origin main
```

### 2. Configuración en Netlify
1. Conecta tu repositorio en Netlify
2. **Build command**: `npm run build`
3. **Publish directory**: `dist/AfinarteStudio/browser`
4. Deploy automáticamente detectará el `netlify.toml`

### 3. Variables de Entorno (si necesarias)
- Node version: 18 o superior
- npm version: 8 o superior

## Verificación

Una vez deployado:
- ✅ La página principal debe cargar: `https://tu-sitio.netlify.app/`
- ✅ Las rutas directas deben funcionar: `https://tu-sitio.netlify.app/contact`
- ✅ El routing interno debe funcionar correctamente
- ✅ Los assets (CSS, JS, imágenes) deben cargar

## Rutas Disponibles
- `/` → Redirige a `/home`
- `/home` → Página principal
- `/contact` → Página de contacto
- `/scheduler` → Página de agenda
- `/login` → Página de login
- `/register` → Página de registro

## Troubleshooting

Si aún tienes problemas:
1. Verifica que el `_redirects` esté en la carpeta `public/`
2. Asegúrate de que el publish directory sea `dist/AfinarteStudio/browser`
3. Revisa los logs de build en Netlify
4. Verifica que no haya errores en la consola del navegador
