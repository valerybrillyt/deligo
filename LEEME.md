# DeliGo — Proyecto completo

## Carpetas

| Carpeta | Qué es |
|---------|--------|
| **FrontedDeligo/** | Frontend Angular (abrir en VS Code) |
| **backend/** | API Node.js + patrones de diseño |
| **database/** | `schema.sql` para DBeaver |

## Pasos para ejecutar

### 1. Base de datos (DBeaver)
Ejecuta `database/schema.sql` en MySQL.

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tu contraseña MySQL
npm install
npm start
```

### 3. Frontend
```bash
cd FrontedDeligo
npm install
npm start
```
Abre http://localhost:4200

## Si npm falla con ENOSPC
Libera **al menos 2–3 GB** en tu Mac (disco al 100%) y vuelve a ejecutar `npm install`.
