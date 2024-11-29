# Ashley Project Setup Guide

## Project Overview
This project sets up a backend application with PostgreSQL database using Docker, Node.js, and Prisma ORM.

## Prerequisites
- Docker
- Node.js (recommended latest LTS version)
- npm (Node Package Manager)

## Setup Instructions

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Spin Up PostgreSQL Database
Run the following Docker command to create a PostgreSQL database container:
```bash
docker run -d --name ashley-db -p 5555:5432 \
  -e POSTGRES_PASSWORD=admin@1234 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=ashley_db \
  postgres
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migration
Initialize and apply database migrations:
```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database
Populate the database with initial data:
```bash
npx prisma db seed
```

### 6. Start the Application
```bash
npm run start
```

## Environment Configuration
- A `.env` file is included for easier testing
- Database connection string is pre-configured in the `.env` file

## Troubleshooting
- Ensure Docker is running before starting the database container
- Check that port 5555 is not in use by another service
- Verify Node.js and npm are installed correctly

## Notes
- Default PostgreSQL credentials:
  - Username: admin
  - Password: admin@1234
  - Database: ashley_db
