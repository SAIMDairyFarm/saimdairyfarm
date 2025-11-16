# Dairy Farm Management System

A comprehensive web-based management system for dairy farm operations, featuring livestock tracking, health records, milk production monitoring, inventory management, and human resources.

## Features

### 1. Livestock & Herd Management
- Complete animal profiles with unique IDs
- Lifecycle tracking (Pregnant, Lactating, Dry, etc.)
- Movement and grouping management
- Parent lineage tracking
- Culling and sales records

### 2. Health & Medical Management
- Medical treatment records
- Vaccination tracking with scheduled alerts
- Doctor consultation records
- Automated vaccination reminders

### 3. Milk Production & Quality
- Daily milk yield tracking (AM/PM sessions)
- Quality metrics (Fat content, SNF, SCC)
- Production analytics and trends
- Individual animal performance tracking

### 4. Feed & Inventory Management
- Stock level monitoring
- Low stock alerts
- Feed allocation tracking
- Purchase history
- Supplier management

### 5. Human Resources
- Employee management
- Doctor/consultant database
- Role-based access control
- Contact information tracking

### 6. User Authentication & Access Control
- JWT-based secure authentication
- Role-based authorization (Admin, Manager, Worker, Veterinarian)
- Session management
- Password encryption

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

**Frontend:**
- HTML5
- CSS3 (Professional responsive design)
- Vanilla JavaScript (No frameworks)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
The `.env` file is already configured with default settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dairy_farm_db
JWT_SECRET=dairy_farm_secret_key_2025_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` in production!

### Step 3: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### Step 4: Initialize Database
Create the default admin user and sample data:
```bash
node init-db.js
```

This will create:
- Admin user: `admin@farm.com` / `admin123`
- Manager user: `manager@farm.com` / `manager123`
- Worker user: `worker@farm.com` / `worker123`

### Step 5: Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@farm.com | admin123 |
| Manager | manager@farm.com | manager123 |
| Worker | worker@farm.com | worker123 |

## Project Structure

```
Dairy Farm Management/
├── models/              # Database models
│   ├── User.js
│   ├── Animal.js
│   ├── MedicalRecord.js
│   ├── MilkRecord.js
│   ├── FeedInventory.js
│   ├── FeedAllocation.js
│   ├── Employee.js
│   └── Doctor.js
├── routes/              # API routes
│   ├── auth.js
│   ├── cows.js
│   ├── medical.js
│   ├── milk.js
│   ├── feed.js
│   ├── hr.js
│   └── alerts.js
├── middleware/          # Authentication middleware
│   └── auth.js
├── public/              # Frontend files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── livestock.js
│   │   ├── medical.js
│   │   ├── milk.js
│   │   ├── feed.js
│   │   └── hr.js
│   ├── login.html
│   ├── dashboard.html
│   ├── livestock.html
│   ├── medical.html
│   ├── milk.html
│   ├── feed.html
│   └── hr.html
├── server.js            # Main server file
├── init-db.js          # Database initialization script
├── package.json
└── .env                # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Livestock
- `GET /api/cows` - Get all animals
- `POST /api/cows` - Create animal
- `PUT /api/cows/:id` - Update animal
- `DELETE /api/cows/:id` - Delete animal

### Medical Records
- `GET /api/medical` - Get all medical records
- `GET /api/medical/animal/:animalId` - Get records by animal
- `POST /api/medical` - Create medical record
- `PUT /api/medical/:id` - Update record
- `DELETE /api/medical/:id` - Delete record

### Milk Production
- `GET /api/milk` - Get all milk records
- `GET /api/milk/stats/production` - Get production statistics
- `POST /api/milk` - Create milk record
- `PUT /api/milk/:id` - Update record
- `DELETE /api/milk/:id` - Delete record

### Feed & Inventory
- `GET /api/feed/inventory` - Get inventory items
- `POST /api/feed/inventory` - Create inventory item
- `PUT /api/feed/inventory/:id` - Update item
- `GET /api/feed/allocations` - Get allocations
- `POST /api/feed/allocations` - Create allocation

### Human Resources
- `GET /api/hr/employees` - Get all employees
- `POST /api/hr/employees` - Create employee
- `GET /api/hr/doctors` - Get all doctors
- `POST /api/hr/doctors` - Create doctor

### Alerts
- `GET /api/alerts` - Get all active alerts

## User Roles & Permissions

### Admin
- Full access to all modules
- Can create, read, update, and delete all records
- User management

### Manager
- Can create and edit records in all modules
- Cannot delete critical records
- Limited user management

### Worker
- Can view all records
- Can create milk production records
- Can create feed allocations
- Limited edit capabilities

### Veterinarian
- Can view livestock and medical records
- Can create and edit medical records
- Can view alerts

## Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes
- Session management
- Input validation

## Support

For issues or questions, please contact the system administrator.

## License

Proprietary - All rights reserved
