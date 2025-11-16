# Quick Start Guide

## Getting Started

Your Dairy Farm Management System is now ready to use! 

### 1. Access the Application

The server is running at: **http://localhost:5000**

Click the preview button to open the application in your browser.

### 2. Login Credentials

Use these default credentials to login:

**Admin Account (Full Access):**
- Email: `admin@farm.com`
- Password: `admin123`

**Manager Account:**
- Email: `manager@farm.com`
- Password: `manager123`

**Worker Account:**
- Email: `worker@farm.com`
- Password: `worker123`

### 3. First Steps

After logging in, you'll see the dashboard with navigation to all modules:

1. **Dashboard** - Overview of farm operations
2. **Livestock Management** - Add and manage animals
3. **Health & Medical** - Track medical records and vaccinations
4. **Milk Production** - Record daily milk production
5. **Feed & Inventory** - Manage feed stock and allocations
6. **Human Resources** - Manage employees and doctors

### 4. Adding Your First Animal

1. Go to **Livestock Management**
2. Click **+ Add Animal**
3. Fill in the required fields:
   - Tag ID (unique identifier)
   - Type (Cow, Calf, Heifer, Bull)
   - Breed
   - Gender
   - Date of Birth
4. Click **Save Animal**

### 5. Recording Milk Production

1. Go to **Milk Production**
2. Click **+ Add Record**
3. Enter:
   - Animal ID (from livestock)
   - Date
   - Session (AM/PM)
   - Quantity in liters
   - Optional: Quality metrics
4. Click **Save Record**

### 6. Managing Inventory

1. Go to **Feed & Inventory**
2. Click **+ Add Item** to add feed stock
3. Set the reorder level to get low stock alerts
4. Use **+ Allocate Feed** to track feed distribution

### 7. Health Records

1. Go to **Health & Medical**
2. Click **+ Add Record**
3. Select record type:
   - Treatment
   - Vaccination
   - Checkup
   - Surgery
4. For vaccinations, set the next vaccination date for automated reminders

### 8. Viewing Alerts

The dashboard automatically shows:
- Overdue vaccinations
- Upcoming vaccinations (within 7 days)
- Low stock items

## Important Notes

### Security
- Change the default passwords immediately after first login
- Update the `JWT_SECRET` in the `.env` file for production use
- Keep MongoDB access secure

### Stopping the Server

To stop the server, press `Ctrl+C` in the terminal where the server is running.

### Restarting the Server

To restart the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Database Backup

It's recommended to regularly backup your MongoDB database:
```bash
mongodump --db dairy_farm_db --out ./backup
```

### Support

For detailed information about all features, refer to the main README.md file.

## System Requirements

- **Node.js**: v14 or higher
- **MongoDB**: v4.4 or higher
- **Browser**: Modern browser (Chrome, Firefox, Edge, Safari)
- **Screen Resolution**: Minimum 1024x768 (responsive design)

## Features Overview

✅ **Livestock Management** - Complete animal profiles with lifecycle tracking
✅ **Health Tracking** - Medical records with automated vaccination alerts
✅ **Milk Production** - Daily yield tracking with quality metrics
✅ **Inventory Management** - Stock monitoring with low stock alerts
✅ **Human Resources** - Employee and doctor management
✅ **Authentication** - Secure JWT-based login with role-based access
✅ **Dashboard** - Real-time analytics and alerts
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Next Steps

1. **Customize** - Add your farm's specific breeds, locations, and groups
2. **Import Data** - If you have existing records, you can bulk import via the API
3. **Train Staff** - Show your team how to use the different modules
4. **Regular Updates** - Keep track of daily activities for accurate records

Enjoy your new Dairy Farm Management System!
