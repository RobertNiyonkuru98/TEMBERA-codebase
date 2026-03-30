# Tembera Backend

This is the backend service for the Tembera project. It is built with Node.js, Express, and Prisma using PostgreSQL.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (or access to a PostgreSQL instance)

## Getting Started

Follow these steps to set up the backend on your local machine:

### 1. Clone the repository

Navigate to the `backend` folder:

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the `backend` directory:

```bash
touch .env
```

Add the following variable to your `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
PORT=3000
```

> [!NOTE]
> Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your actual PostgreSQL credentials.

### 4. Initialize Prisma

Generate the Prisma Client and apply migrations to set up your database schema:

```bash
# Apply any existing migrations
npx prisma migrate dev --name init

# Generate the Prisma Client
npx prisma generate
```

## Development

To start the server in development mode with automatic reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3000/api`.

## API Documentation

Swagger documentation is available at:
`http://localhost:3000/api/docs`

## Docker: Build And Push To Docker Hub

Use this guide to publish your backend image to Docker Hub.

### 1. Build the Docker image locally

From the `backend` directory:

```bash
docker build -t tembera-backend:latest .
```

### 2. Login to Docker Hub

```bash
docker login
```

### 3. Tag the image for your Docker Hub repository

Replace `DOCKERHUB_USERNAME` with correct Docker Hub username and which holds the project in ths case `elijahladdie`

```bash
docker tag tembera-backend:latest DOCKERHUB_USERNAME/tembera-backend:latest
```

Optional versioned tag:

```bash
docker tag tembera-backend:latest DOCKERHUB_USERNAME/tembera-backend:v1.0.0
```

### 4. Push image to Docker Hub

```bash
docker push DOCKERHUB_USERNAME/tembera-backend:latest
docker push DOCKERHUB_USERNAME/tembera-backend:v1.0.0
```

### 5. Pull and run from Docker Hub (verification)

```bash
docker pull DOCKERHUB_USERNAME/tembera-backend:latest
docker run -d --name tembera-backend-app \
	--env-file .env \
	-e SKIP_MIGRATIONS=true \
	-p 3001:3000 \
	DOCKERHUB_USERNAME/tembera-backend:latest
```

Then confirm it is running:

```bash
docker ps
docker logs --tail 100 tembera-backend-app
curl -I http://localhost:3001/api/docs
```

### 6. Update release flow (recommended)

When you ship a new release:

1. Build new image from current source.
2. Tag with a new version (for example `v1.0.1`).
3. Push both `latest` and the version tag.
4. Deploy using the version tag in production for safer rollbacks.

## Database Management

Whenever you update the `prisma/schema.prisma` file, you must run:

### Apply Schema Changes

```bash
npx prisma migrate dev --name your_change_description
```

### View Data (Prisma Studio)

To browse your database visually, run:

```bash
npx prisma studio
```

## Project Structure

- `src/index.ts`: Entry point of the application.
- `prisma/schema.prisma`: Database schema definition.
- `prisma.config.ts`: Prisma 7 configuration file.
- `.env`: Environment variables (not tracked in Git).

## Troubleshooting

### Prisma Initialization Error

If you see an error related to `PrismaClientInitializationError`, ensure that:

1. Your `DATABASE_URL` in `.env` is correct.
2. You have run `npx prisma generate`.
3. You are using the `PrismaPg` adapter in `src/index.ts` (this project uses Prisma 7).
