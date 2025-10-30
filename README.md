# Chunk Frontend - Angular Application

## Overview
This is the frontend application for Chunk, a junk removal marketplace built with Angular and TypeScript.

## Tech Stack
- Angular 17+ (Latest LTS)
- TypeScript
- Tailwind CSS
- Angular Material
- Socket.IO Client
- Stripe Elements

## Project Structure
```
src/
├── app/
│   ├── core/           # Core services and guards
│   ├── shared/         # Shared components and utilities
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication
│   │   ├── customer/   # Customer dashboard
│   │   ├── driver/     # Driver dashboard
│   │   └── admin/      # Admin console
│   └── app.component.*
├── assets/             # Images, fonts, etc.
└── environments/       # Environment configs
```

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI

### Installation
```bash
npm install
```

### Development
```bash
ng serve
```

### Build
```bash
ng build --configuration production
```

## Environment Variables
Create `src/environments/environment.ts` and `environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  stripeKey: 'pk_test_your_stripe_key',
  googleMapsKey: 'your_google_maps_key'
};
```