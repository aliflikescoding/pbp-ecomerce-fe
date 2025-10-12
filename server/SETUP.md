# Setup Backend Server

## Prerequisites

1. Node.js (v18 atau lebih baru)
2. PostgreSQL database server
3. npm atau yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Menggunakan PostgreSQL yang sudah terinstall

1. Pastikan PostgreSQL server berjalan
2. Buat database baru bernama `pbp_ecommerce`
3. Update file `.env` dengan kredensial database yang benar:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/pbp_ecommerce"
   ```

#### Option B: Menggunakan SQLite (untuk development cepat)

Jika tidak ada PostgreSQL, bisa ganti ke SQLite dengan mengubah `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Database Migrations

```bash
npm run prisma:migrate:dev
```

### 5. Create Admin User (Optional)

```bash
npm run script:generateAdmin
```

### 6. Start Development Server

```bash
npm run devstart
```

Server akan berjalan di http://localhost:5000

## Available Scripts

- `npm start` - Run production server
- `npm run devstart` - Run development server with auto-restart
- `npm run prisma:migrate:dev` - Run database migrations in development
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run script:generateAdmin` - Create admin user

## API Endpoints

Base URL: `http://localhost:5000/api`

- `/user` - User authentication and profile
- `/admin` - Admin operations
- `/category` - Product categories
- `/product` - Products management
- `/cart` - Shopping cart
- `/order` - Orders management

## File Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/
│   └── uploads/               # Uploaded files
├── src/
│   ├── app.js                 # Main application
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── routes/                # API routes
│   └── scripts/               # Utility scripts
├── .env                       # Environment variables
└── package.json
```

## Environment Variables

```
DATABASE_URL="postgresql://username:password@localhost:5432/pbp_ecommerce"
PORT=5000
JWT_SECRET="your_jwt_secret_key_here"
```
