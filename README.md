# Smart Wallet - Premium Fintech Expense Tracker

A production-ready, premium SaaS-style full-stack fintech web application built using **React (Vite, Tailwind, Recharts)** on the frontend and **Java Spring Boot (MVC, JPA, Hibernate, MySQL, JWT Security)** on the backend. Designed with elegant glassmorphism aesthetics, responsive tables/cards, dynamic color-bubble grids, and automated Docker orchestration.

---

## 📸 Key Features

- **Double-Panel Dashboard:** Premium KPI cards (Income, Expenses, Net Balance, Savings Rate) and interactive Recharts graphs.
- **Unified Activity Feed:** Automatically aggregates both incomes and expenses chronologically into one visual log stream.
- **Timeline Gradient Charts:** 6-Month Income vs. Expense Area graph and category distribution Donut charts with customized tooltips.
- **Categorization Settings:** Seeding default presets (Food, Travel, Shopping, Bills, Entertainment, Health) alongside custom category additions using color-bubble selectors and Lucide grid components.
- **Double Action Modals:** Fast slide-up frosted modal drawers to create/update transaction streams dynamically.
- **Granular Security:** JWT stateless authentication (validated from Authorization Bearer headers), storing passwords securely using BCrypt hashes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React JS (Functional components, custom hooks)
- **Styling:** Tailwind CSS (Frosted glass effects, radial backgrounds, micro-animations)
- **Charts:** Recharts (Transparent gradients, hovering badges)
- **Icons:** Lucide React
- **API Client:** Axios (Interceptors injecting authorization tokens)

### Backend
- **Core:** Java Spring Boot (v3.2.5), Spring MVC
- **Security:** Spring Security 6 (Stateless JWT auth pipeline, CORS mappings)
- **Data Layer:** Hibernate, Spring Data JPA
- **Database:** MySQL 8.x
- **Build Tool:** Maven

### DevOps & Containerization
- **Docker:** Multi-stage image packaging for JVM APIs and Nginx web servers.
- **Orchestration:** Docker Compose (Automates database health pings and bridged container networking).

---

## 📁 Directory Structure

```
Smart Expense Tracker/
├── backend/                  # Java Spring Boot REST API
│   ├── src/main/java/.../
│   │   ├── config/           # Database seeders
│   │   ├── controller/       # REST MVC Controllers
│   │   ├── dto/              # Form payload models
│   │   ├── entity/           # JPA DB Entity maps
│   │   ├── exception/        # Global error handlers
│   │   ├── repository/       # JPA CRUD Interfaces
│   │   ├── security/         # JWT filter and providers
│   │   └── service/          # Core Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                 # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── components/       # Sidebars, Navbars, Modals, Cards
│   │   ├── context/          # Persistent Auth Context
│   │   ├── pages/            # Login, Signup, Ledger grids, Analytics
│   │   ├── services/         # Axios api integrations
│   │   ├── App.jsx           # SPA Protected Router
│   │   ├── index.css         # Glass backgrounds & glow gradients
│   │   └── main.jsx          # DOM mounter
│   ├── Dockerfile
│   ├── nginx.conf            # Custom Nginx SPA router config
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml        # Orchestration configurations
├── .env.example              # Variables mappings
└── README.md                 # Documentation
```

---

## 🚀 Getting Started

### Method 1: Using Docker Compose (Recommended - Zero Installation)
Prerequisite: Install Docker and Docker Compose.

1. Clone the project and navigate to the directory.
2. Fire up the entire stack using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Open your browser and navigate to:
   - **Frontend:** [http://localhost](http://localhost) (Served on port 80 via Nginx)
   - **Backend API:** [http://localhost:8080/api](http://localhost:8080/api) (Port 8080)
   - **MySQL:** Port 3306

---

### Method 2: Manual Local Development Setup

#### Prerequisite 1: Seed MySQL Database
1. Launch your local MySQL server and log in:
   ```sql
   CREATE DATABASE expense_tracker;
   ```

#### Prerequisite 2: Configure Environment Variables
Copy `.env.example` to a new file named `.env` and adjust the variables:
```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=expense_tracker
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

#### Step 3: Run the Backend Rest API
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Build and package the application:
   ```bash
   mvn clean package
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

#### Step 4: Run the React UI Frontend
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference Catalog

All protected endpoints require a `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication
- `POST /api/auth/register` - Create user
  - Payload: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`
- `POST /api/auth/login` - Authenticate user
  - Payload: `{ "email": "john@example.com", "password": "securepassword" }`
  - Returns: `{ "token": "...", "id": 1, "name": "John Doe", "email": "..." }`

### Category Management (Preset & Custom)
- `GET /api/categories` - Fetch all categories (presets + custom)
- `POST /api/categories` - Create custom category
  - Payload: `{ "name": "Coffee", "color": "#F59E0B", "icon": "Coffee" }`
- `PUT /api/categories/{id}` - Edit custom category
- `DELETE /api/categories/{id}` - Delete custom category

### Expenses CRUD
- `GET /api/expenses` - Retrieve filtered expenses
  - Query params: `search`, `categoryId`, `startDate`, `endDate`
- `POST /api/expenses` - Record expense
  - Payload: `{ "amount": 25.50, "title": "Coffee with client", "date": "2026-05-25", "categoryId": 1, "description": "Quick sync" }`
- `PUT /api/expenses/{id}` - Edit expense
- `DELETE /api/expenses/{id}` - Delete expense

### Incomes CRUD
- `GET /api/incomes` - Retrieve filtered incomes
  - Query params: `search`, `startDate`, `endDate`
- `POST /api/incomes` - Record income
  - Payload: `{ "amount": 2500.00, "source": "Freelance payment", "date": "2026-05-25", "description": "SaaS coding" }`
- `PUT /api/incomes/{id}` - Edit income
- `DELETE /api/incomes/{id}` - Delete income

### Analytics & Summaries
- `GET /api/analytics/dashboard` - Fetches KPI sums, saving rate percentage, and recent 5 unified transaction logs.
- `GET /api/analytics/charts` - Fetches 6-month historical monthly arrays and categorical breakdown arrays.
