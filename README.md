# Proyecto Next.js Panel

Este es un proyecto de Next.js moderno construido con TypeScript, Tailwind CSS y ESLint preconfigurado.

## 🛠️ Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de estilos utility-first
- **ESLint** - Linter para mantener código limpio
- **Turbopack** - Bundler ultrarrápido para desarrollo

## 🚀 Comenzar

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001) en tu navegador para ver el resultado.

## 📁 Estructura del Proyecto

```
src/
├── app/                # App Router (páginas y layouts)
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de inicio
├── components/         # Componentes reutilizables
│   ├── Button.tsx      # Componente de botón
│   ├── Card.tsx        # Componente de tarjeta
│   └── index.ts        # Barrel export
└── lib/
    └── utils.ts        # Utilidades (clsx + tailwind-merge)
```

## 🎯 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta ESLint

## 📚 Recursos de Aprendizaje

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Tutorial Interactivo de Next.js](https://nextjs.org/learn)

## 🚀 Despliegue

La forma más fácil de desplegar tu aplicación Next.js es usar [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## ✨ Características Incluidas

- ✅ TypeScript configurado
- ✅ Tailwind CSS con configuración optimizada
- ✅ ESLint con reglas de Next.js
- ✅ Componentes ejemplo (Button, Card)
- ✅ Utilidades de clases CSS (clsx + tailwind-merge)
- ✅ Hot reload con Turbopack
- ✅ Estructura de carpetas organizada
