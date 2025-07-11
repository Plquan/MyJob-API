# MyJob-API

MyJob-API is a backend RESTful API system for a job recruitment platform, built with Node.js, TypeScript, and Express. The project supports user management, candidates, employers, job postings, resumes, skills, certificates, and many other recruitment-related features.

## Main Features
- User registration, login, authentication
- Candidate, employer, and profile management
- Job posting management, save jobs, apply for jobs
- Manage skills, certificates, education, experience
- Service package management, payment, transaction history
- Role-based access control and permissions
- File upload integration, Cloudinary support
- Rate Limiter, Authentication Middleware, Logging

## Technologies Used
- Node.js, Express.js
- TypeScript
- TypeORM
- PostgreSQL/MySQL (configurable)
- Redis (cache, rate limit)
- Cloudinary (file storage)
- JWT (authentication)

## Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd MyJob-API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file based on the template in `src/configs/constants/env.ts`.
   - Set up database, JWT, Cloudinary, Redis, etc.
4. Run migrations and seed data:
   ```bash
   npm run typeorm migration:run
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/controllers/` - Request controllers
- `src/entity/` - ORM entity definitions
- `src/interfaces/` - Interfaces, DTOs
- `src/middlewares/` - Middlewares (auth, rate limit, upload, etc.)
- `src/services/` - Business logic
- `src/configs/` - System configuration
- `src/helpers/`, `src/ultils/` - Helper and utility functions
- `src/seeds/`, `src/migrations/` - Database seeders and migrations

## Scripts
- `npm run dev` - Run server in development mode (nodemon)
- `npm run build` - Build the project
- `npm start` - Run server in production
- `npm run typeorm` - Run TypeORM commands (migration, seed, etc.)
- `npm run migration` - Run database migrations

## Contribution
Pull requests, issues, and feedback are welcome!

## License
MIT
