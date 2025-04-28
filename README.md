# InterviewZ Backend

Backend service for InterviewZ application built with NestJS.

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/interviewz-be.git
cd interviewz-be
```

### 2. Environment Setup

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin
DB_NAME=interviewz

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:4000
```

### 3. Running with Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Build and start the containers
docker-compose up --build

# To run in detached mode
docker-compose up -d

# To stop the containers
docker-compose down
```

This will start:
- NestJS application on http://localhost:3000
- PostgreSQL database on port 5432

### 4. Running without Docker

If you prefer to run the application without Docker:

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL database:
```bash
# Using Docker for database only
docker-compose up db
```

3. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Development

### Available Scripts

- `npm run start:dev` - Start the application in development mode with hot-reload
- `npm run build` - Build the application
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

### Project Structure

```
src/
├── config/           # Configuration files
│   └── typeorm.config.ts  # TypeORM configuration
├── modules/          # Feature modules
│   ├── auth/        # Authentication module
│   ├── user/        # User module
│   └── resume/      # Resume module
├── migrations/       # Database migrations
│   └── *.ts         # Migration files
├── shared/          # Shared utilities and components
├── database/        # Database configuration and migrations
├── common/          # Common utilities and helpers
├── app.module.ts    # Root application module
├── app.controller.ts # Root application controller
├── app.service.ts   # Root application service
└── main.ts          # Application entry point
```

### Database Migrations

The application uses TypeORM migrations to manage database schema changes. Here's how to work with migrations:

#### Creating a New Migration

1. Create a new migration file:
```bash
npm run migration:create src/migrations/YourMigrationName
```

This will create a new migration file with `up()` and `down()` methods.

2. Implement the migration:
```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add your migration logic here
        // Example: await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "newField" varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add your rollback logic here
        // Example: await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "newField"`);
    }
}
```

#### Generating Migrations

To generate a migration based on entity changes:

```bash
npm run migration:generate src/migrations/YourMigrationName
```

This will compare your current database schema with your entity definitions and create a migration file with the necessary changes.

#### Running Migrations

To apply pending migrations:

```bash
npm run migration:run
```

#### Rolling Back Migrations

To revert the last applied migration:

```bash
npm run migration:revert
```

**Note**: Always backup your database before running migrations in production.

### API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Database

The application uses a separate database for testing. The test database configuration is handled automatically by the test setup.

## Deployment

The application is configured for deployment on AWS ECS using GitHub Actions. The deployment process is automated through CI/CD pipeline.

### Deployment Environments

- Development: `develop` branch
- Staging: `staging` branch
- Production: `main` branch

### Required Secrets for Deployment

The following secrets need to be configured in GitHub:

- `DB_USER` - Database username
- `DB_PASS` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `JWT_REFRESH_SECRET` - JWT refresh secret key
- `JWT_REFRESH_EXPIRES_IN` - JWT refresh expiration time
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License.
