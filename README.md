# Ecocardiograma Transtorácico App

Esta aplicación de escritorio está diseñada para gestionar ecocardiogramas transtorácicos, facilitando el registro, visualización y análisis de estudios médicos.

## Tecnologías

- Electron: Framework para crear aplicaciones de escritorio multiplataforma
- Vite: Herramienta de construcción para desarrollo frontend
- React: Biblioteca JavaScript para construir interfaces de usuario
- TypeScript: Superset tipado de JavaScript
- Tailwind CSS: Framework de CSS utility-first

## Características

- Gestión de pacientes
- Registro de estudios ecocardiográficos
- Generación de informes médicos
- Interfaz moderna y responsiva

## Instalación

```bash
# Clonar el repositorio
git clone [url-repositorio]

# Navegar al directorio del proyecto
cd ecocardiograma-transtoracico-app

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## Scripts disponibles

- `npm run dev` - Inicia la aplicación en modo desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run lint` - Ejecuta el linter para verificar la calidad del código

## Distribución

Para crear un paquete distribuible:

```bash
npm run build
```

Esto generará instaladores en el directorio `release/[version]`.

## Licencia

[MIT](LICENSE)
