# GoCamply
Backend for the GoCamply, campground booking platform for adventurous hikers.

## Prerequisites

- Node.js (recommended LTS, e.g. v18+). You don't need to run `npm init` because this repository already contains `package.json` and `package-lock.json`.
- MongoDB connection (Atlas or local).

## Setup

1. Install dependencies (use this once after cloning):

```bash
npm install
```

`package.json` and `package-lock.json` are committed, running `npm init` is not necessary unless you plan to reinitialize the package metadata.

2. Create configuration (environment) variables

This project expects a `config/config.env` file (or equivalent environment variables). Create `config/config.env` and add the following variables (replace the placeholders with your values):

```env
PORT=5003
NODE_ENV=development
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-jwt-secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

Important: Do NOT commit secrets (production credentials, JWT secrets, etc.) to version control. Use environment variables or a private secrets store for production deployments.

3. Run the app in development

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

