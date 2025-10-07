# CKD Digital Twin Dashboard

Enterprise-grade 3D visualization dashboard for Chronic Kidney Disease (CKD) digital twin modeling using React.js and Three.js.

## Features

- 🏥 **3D Kidney Visualization** - Interactive 3D models with real-time data integration
- 📊 **Clinical Dashboard** - Comprehensive patient monitoring interface
- 🔐 **Enterprise Security** - HIPAA compliant with Auth0 authentication
- ⚡ **Real-time Updates** - WebSocket integration for live data
- 📱 **Responsive Design** - Works on desktop and tablet devices

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Auth0 credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: Redux Toolkit + RTK Query
- **UI Framework**: Material-UI v5
- **Authentication**: Auth0
- **Real-time**: Socket.io

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── 3d/             # Three.js 3D components
│   ├── Layout/         # Layout components
│   └── common/         # Generic components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── store/              # Redux store and slices
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## License

Private - Healthcare Application