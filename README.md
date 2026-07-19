# Employee Management System (EMS)

A full-stack employee management application with role-based access control, organizational hierarchy visualization, and comprehensive employee data management.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database (Neon Tech)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Input validation

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication with secure cookie storage
  - Role-based access control (SUPER_ADMIN, HR_MANAGER, EMPLOYEE)
  - Protected routes with role verification

- **Employee Management**
  - Create, read, update, and delete employee records
  - Employee profile management with photo uploads
  - Search and filter employees
  - Employee details view

- **Organization Hierarchy**
  - Visual organization tree structure
  - Reporting manager relationships
  - Department-based organization

- **Dashboard**
  - Overview of employee statistics
  - Quick access to key features

## 📁 Project Structure

```
ems-project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configurations
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Express application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # API route definitions
│   │   ├── validation/   # Input validation schemas
│   │   ├── __tests__/    # Test files
│   │   ├── seed.js       # Database seeding script
│   │   └── server.js     # Entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/   # Database migrations
│   └── package.json
└── .gitignore
```

## 🗄️ Database Schema

### Employee Model
- **id**: UUID (primary key)
- **employeeCode**: Unique employee identifier
- **name**: Full name
- **email**: Unique email address
- **passwordHash**: Encrypted password
- **phone**: Contact number
- **department**: Department name
- **designation**: Job title
- **salary**: Salary amount
- **joiningDate**: Date of joining
- **status**: ACTIVE/INACTIVE
- **role**: SUPER_ADMIN/HR_MANAGER/EMPLOYEE
- **profileImageUrl**: Profile picture URL
- **reportingManagerId**: Self-referencing foreign key for hierarchy
- **isDeleted**: Soft delete flag
- **createdAt/updatedAt**: Timestamps

## 🔧 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ems-project
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   PORT=5000
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Seed the database** (optional)
   ```bash
   node src/seed.js
   ```
   
   This creates two default users:
   - **Super Admin**: admin@ems.com / Admin@123
   - **Employee**: employee@ems.com / Employee@123

## 🏃 Running the Application

### Start the development servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production build

**Build frontend:**
```bash
cd client
npm run build
```

**Start backend:**
```bash
cd server
npm start
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee (ADMIN/HR only)
- `PUT /api/employees/:id` - Update employee (ADMIN/HR only)
- `DELETE /api/employees/:id` - Delete employee (ADMIN only)

### Organization
- `GET /api/organization/tree` - Get organization hierarchy
- `GET /api/organization/stats` - Get organization statistics

### Health Check
- `GET /api/health` - Check server and database status

## 👥 User Roles

### SUPER_ADMIN
- Full access to all features
- Can create, edit, and delete employees
- Can manage organization structure
- Can assign managers

### HR_MANAGER
- Can create and edit employees
- Can view organization structure
- Cannot delete employees or manage admins

### EMPLOYEE
- Can view employee directory
- Can view organization structure
- Can view own profile
- Limited access to management features

## 🧪 Testing

```bash
cd server
npm test
```

## 📝 Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Secure cookie storage
- CORS configuration
- Input validation with Zod
- Role-based access control
- SQL injection prevention via Prisma ORM

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Employee Management System Development Team

## 🙏 Acknowledgments

- Built with modern web technologies
- Database hosted on Neon Tech
- UI styled with TailwindCSS
