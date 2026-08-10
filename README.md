# Fabric Store Inventory Management System

## Project Title

**Fabric Store Inventory Management System**

## Student Name

**Ofem Patrick**

## Matric Number

**24/CSC/227**

## Assigned Inventory Type

**Fabric Store Inventory**

---

## Project Description

The Fabric Store Inventory Management System is a web-based inventory management application designed to help fabric store owners and staff manage their products, categories, suppliers, stock levels, and stock movements efficiently.

The system provides a centralized platform for managing fabric products and monitoring inventory levels. It allows authorized users to add, edit, view, and manage products, categories, suppliers, and inventory records.

The application also provides a dashboard containing important inventory statistics such as total products, total stock, low-stock items, and out-of-stock products.

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5.3.3
* Bootstrap Icons
* Fetch API

### Backend

* Node.js
* Express.js
* REST API

### Database

* MySQL
* XAMPP
* phpMyAdmin

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* XAMPP

---

## Installation Instructions

### 1. Clone or Download the Project

Clone the project from GitHub or download the project files.


git clone https://github.com/paris1-hacker/fabric-store-inventory


Then enter the project directory:

cd fabric-store

### 2. Install Backend Dependencies

Open the terminal inside the backend directory and run:

```bash
npm install
```

This installs all required Node.js packages.

### 3. Start XAMPP

Open XAMPP Control Panel and start:

* Apache
* MySQL

Make sure MySQL is running before starting the backend.

### 4. Configure the Database

Create the database:

```sql
CREATE DATABASE fabric_store;
```

Import the provided SQL database export into the `fabric_store` database.

Database configuration should match the project's database configuration file.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fabric_store
DB_PORT=3306
```

### 5. Start the Backend

Run:

```bash
npm start
```

or, if your project uses nodemon:

```bash
npm run dev
```

The API should then be available at:

```text
http://localhost:5000
```

### 6. Open the Frontend

Open the frontend using VS Code Live Server or another local frontend server.

For example:

```text
http://127.0.0.1:5500/
```

The frontend communicates with the backend API running on:

```text
http://localhost:5000
```

---

# Database Setup

The project uses **MySQL** as its database.

The database name is:

```text
fabric_store
```

The database contains the following major tables:

```text
categories
suppliers
products
inventory
stock_movements
users
settings
```

### Database Relationships

The `products` table is connected to the `categories` and `suppliers` tables.

```text
categories
     │
     │ category_id
     ▼
  products
     │
     │ product_id
     ▼
 inventory
```

Products also reference suppliers:

```text
suppliers
     │
     │ supplier_id
     ▼
  products
```

Inventory records reference products using:

```text
inventory.product_id → products.id
```

Stock movements are associated with products and users.

---

# Login Credentials

If sample login credentials have been created in the database, they can be entered below.

### Administrator

```text
Email: paris@gmail.com
Password: 123456
```

---

# Features Implemented

## Dashboard

* View total number of products
* View total inventory stock
* View low-stock products
* View out-of-stock products
* View recent stock movements
* View inventory alerts
* Responsive dashboard layout

## Product Management

* Add products
* View products
* Edit products
* Delete products
* Assign products to categories
* Assign products to suppliers
* Record fabric material
* Record fabric color
* Record fabric pattern
* Set price per yard
* Add product descriptions

## Category Management

* View all categories
* Add categories
* Edit categories
* Delete categories
* Search categories
* View category descriptions
* View category creation dates

## Supplier Management

* View all suppliers
* Add suppliers
* Edit suppliers
* Delete suppliers
* Store supplier contact information
* Store supplier phone numbers
* Store supplier email addresses
* Store supplier addresses

## Inventory Management

* View inventory records
* Track product quantities
* Set reorder levels
* Identify low-stock products
* Identify out-of-stock products
* Update inventory quantities

## Stock Movement Management

* Record stock movements
* Track stock additions
* Track stock reductions
* Track movement quantities
* Track the user responsible for movements
* View recent inventory activity

## User Management

* User authentication
* User information
* User roles
* Administrator account
* Staff account management

## Settings

* Manage system settings
* Configure inventory-related settings

---

# API Endpoints

The backend provides REST API endpoints for the application's resources.

### Categories

```text
GET     /api/categories
GET     /api/categories/:id
POST    /api/categories
PUT     /api/categories/:id
DELETE  /api/categories/:id
```

### Suppliers

```text
GET     /api/suppliers
GET     /api/suppliers/:id
POST    /api/suppliers
PUT     /api/suppliers/:id
DELETE  /api/suppliers/:id
```

### Products

```text
/api/products
```

### Inventory

```text
/api/inventory
```

### Stock Movements

```text
/api/stock-movements
```

### Users

```text
/api/users
```

### Dashboard

```text
/api/dashboard
```

### Settings

```text
/api/settings
```

---

# Folder Structure

The project is organized into separate frontend and backend components.

fabric-store/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   ├── inventoryController.js
│   │   ├── productController.js
│   │   ├── settingsController.js
│   │   ├── stockMovementController.js
│   │   ├── supplierController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── categoryModel.js
│   │   ├── inventoryModel.js
│   │   ├── productModel.js
│   │   ├── settingsModel.js
│   │   ├── stockMovementModel.js
│   │   ├── supplierModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── stockMovementRoutes.js
│   │   ├── supplierRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── dashboard.js
│   │   ├── inventory.js
│   │   ├── products.js
│   │   ├── settings.js
│   │   ├── stock-movements.js
│   │   ├── suppliers.js
│   │   └── users.js
│   │
│   ├── index.html
│   ├── dashboard.html
│   ├── products.html
│   ├── categories.html
│   ├── suppliers.html
│   ├── inventory.html
│   ├── stock-movements.html
│   ├── users.html
│   └── settings.html
│
├── database/
│   └── fabric_store.sql
│
├── README.md


---

# Database Export

A MySQL database export should be included in the project:

```text
database/fabric_store.sql
```

This file allows another developer or examiner to recreate the database without manually creating every table.

To import the database:

1. Open XAMPP.
2. Start MySQL and Apache.
3. Open phpMyAdmin.
4. Create/select the `fabric_store` database.
5. Click **Import**.
6. Select `fabric_store.sql`.
7. Click **Import** or **Go**.
8. Confirm that all tables have been created successfully.

---

# Author

**Student Name:** Ofem Patrick

**Project:** Fabric Store Inventory Management System
