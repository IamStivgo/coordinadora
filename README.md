# Node.js TypeScript API Project

Este proyecto es una API REST construida con Node.js, TypeScript, Express, MySQL y Redis.

## Requisitos Previos

- Node.js v18.x
- npm o yarn
- MySQL (local o Docker)
- Redis (local o Docker)

## Tecnologías Principales

- Node.js v18
- TypeScript
- Express
- MySQL
- Redis
- Docker (opcional)


## Configuración del Entorno

1. Clona el repositorio:
```bash
git clone https://github.com/IamStivgo/coordinadora
cd coordinadora
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

# Redis
CACHE_URL

# JWT
JWT_SECRET
```

## Ejecución del Proyecto

### Desarrollo Local sin Docker

1. Asegúrate de tener MySQL y Redis ejecutándose localmente

2. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

### Usando Docker

El proyecto incluye configuración Docker para un entorno de desarrollo completo.

1. Construye y levanta los contenedores:
```bash
docker-compose up -d
```

2. La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload

## Docker

Si utilizas Docker, el proyecto cuenta con un Dockerfile y docker-compose.yml para
ejecutar la base de datos y el manejo de cache.



## Manejo de Caché con Redis

El proyecto utiliza Redis para cachear respuestas frecuentes y mejorar el rendimiento:

- Caché de consultas frecuentes
- Almacenamiento de sesiones
- Rate limiting

