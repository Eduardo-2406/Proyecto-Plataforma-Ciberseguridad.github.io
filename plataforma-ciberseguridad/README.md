# Plataforma de Ciberseguridad

Una plataforma web moderna para la comunidad de ciberseguridad, construida con React y Firebase.

## Características

- 🔐 Autenticación de usuarios con Firebase
- 💬 Sistema de foro para discusiones
- 🏆 Sistema de gamificación con insignias y niveles
- 🔔 Sistema de notificaciones en tiempo real
- 📱 Diseño responsive y moderno

## Tecnologías Utilizadas

- React 18
- Firebase (Authentication, Realtime Database)
- Vite
- CSS Moderno
- Font Awesome
- Google Fonts

## Requisitos Previos

- Node.js 16.x o superior
- npm 7.x o superior
- Cuenta de Firebase

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/plataforma-ciberseguridad.git
cd plataforma-ciberseguridad
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
plataforma-ciberseguridad/
├── src/
│   ├── components/        # Componentes React
│   ├── config/           # Configuración de Firebase
│   ├── styles/           # Estilos CSS
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── public/              # Archivos estáticos
├── index.html          # HTML principal
└── package.json        # Dependencias y scripts
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

Link del Proyecto: [https://github.com/tu-usuario/plataforma-ciberseguridad](https://github.com/tu-usuario/plataforma-ciberseguridad)
