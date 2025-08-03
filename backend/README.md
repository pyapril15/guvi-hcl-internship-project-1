# 🧮 Calculator Backend

A robust REST API backend for a calculator application with persistent calculation history storage and comprehensive CRUD operations.

## ✨ Features

- **RESTful API** with TypeScript
- **MySQL Database** integration with connection pooling
- **Complete CRUD Operations** (Create, Read, Update, Delete)
- **Input validation** and sanitization with Joi
- **Comprehensive error handling** and logging
- **CORS** support for frontend integration
- **Security** middleware with Helmet.js
- **Database migrations** with auto-setup
- **Health monitoring** endpoints
- **Graceful shutdown** handling
- **Calculation verification** server-side
- **Production-ready** deployment configuration

## 📋 API Endpoints

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with database status |
| GET | `/api/ping` | Simple connectivity test |
| GET | `/api/info` | API information and endpoints |

### Calculations CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculations` | Get all calculations (newest first) |
| GET | `/api/calculations/:id` | Get specific calculation by ID |
| POST | `/api/calculations` | Create new calculation |
| DELETE | `/api/calculations` | Delete all calculations |
| DELETE | `/api/calculations/:id` | Delete specific calculation |

## 📖 API Documentation

### POST /api/calculations
Create a new calculation record with server-side verification.

**Request Body:**
```json
{
  "operand1": 10,
  "operator": "+",
  "operand2": 5,
  "result": 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calculation created successfully",
  "data": {
    "id": 1,
    "operand1": 10,
    "operator": "+",
    "operand2": 5,
    "result": 15,
    "timestamp": "2025-07-28T12:00:00.000Z"
  }
}
```

### GET /api/calculations
Retrieve all calculation records ordered by newest first.

**Response:**
```json
{
  "success": true,
  "message": "Calculations retrieved successfully",
  "data": [
    {
      "id": 2,
      "operand1": 20,
      "operator": "*",
      "operand2": 3,
      "result": 60,
      "timestamp": "2025-07-28T12:01:00.000Z"
    },
    {
      "id": 1,
      "operand1": 10,
      "operator": "+",
      "operand2": 5,
      "result": 15,
      "timestamp": "2025-07-28T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "count": 2
  }
}
```

### DELETE /api/calculations
Delete all calculations from the database.

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 2 calculations",
  "data": {
    "deletedCount": 2
  }
}
```

### GET /api/health
Comprehensive health check including database connectivity.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-07-28T12:00:00.000Z",
  "uptime": 3600.123,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": true,
    "server": true
  }
}
```

## 🚀 Quick Setup

### Prerequisites
- **Node.js** 18+
- **MySQL** 5.7+ or 8.0+
- **npm** or **yarn**

### 1. Installation
```bash
# Clone and install dependencies
git clone <repository-url>
cd calculator-backend
npm install
```

### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE calculator_db;
exit

# Run migrations (auto-creates tables)
npm run migrate
```

### 4. Start Development Server
```bash
npm run dev
```

**Server will be available at:** `http://localhost:3006`

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3006
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=calculator_db
DB_CONNECTION_LIMIT=10
DB_TIMEOUT=60000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined
```

## 📂 Project Structure

```
calculator-backend/
├── src/
│   ├── config/
│   │   ├── config.ts              # Environment configuration
│   │   └── database.ts            # MySQL connection pool
│   ├── controllers/
│   │   └── calculationController.ts # Request handlers
│   ├── database/
│   │   └── migrate.ts             # Database migrations
│   ├── middleware/
│   │   ├── errorHandler.ts        # Global error handling
│   │   ├── requestLogger.ts       # HTTP request logging
│   │   └── validation.ts          # Joi input validation
│   ├── models/
│   │   └── calculationModel.ts    # Database operations
│   ├── routes/
│   │   ├── calculationRoutes.ts   # Calculation endpoints
│   │   └── index.ts               # Main routes + health
│   ├── types/
│   │   └── calculation.ts         # TypeScript interfaces
│   ├── utils/
│   │   └── logger.ts              # Winston logger setup
│   ├── app.ts                     # Express application
│   └── server.ts                  # Server entry point
├── logs/                          # Log files (auto-created)
├── migrate-simple.js              # Simple migration script
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🛠️ NPM Scripts

```bash
# Development
npm run dev              # Start with auto-reload
npm run migrate          # Run database migrations
npm run setup           # Complete setup (migrate + instructions)

# Production
npm run build           # Compile TypeScript
npm start              # Run production build
npm run rebuild        # Clean build + compile

# Development Tools
npm run lint           # Check code style
npm run lint:fix       # Fix code style issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
npm test              # Run tests (when available)
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin request handling
- **Input Validation** - Joi schema validation
- **SQL Injection Prevention** - Parameterized queries
- **Error Sanitization** - Safe error messages in production
- **Rate Limiting Ready** - Configurable request limits

## 🗄️ Database Schema

### calculations table
```sql
CREATE TABLE calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operand1 DECIMAL(20, 10) NOT NULL,
    operator ENUM('+', '-', '*', '/') NOT NULL,
    operand2 DECIMAL(20, 10) NOT NULL,
    result DECIMAL(20, 10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp DESC)
);
```

## 🧪 Testing

### Manual API Testing
```bash
# Health check
curl http://localhost:3006/api/health

# Get all calculations
curl http://localhost:3006/api/calculations

# Create calculation
curl -X POST http://localhost:3006/api/calculations \
  -H "Content-Type: application/json" \
  -d '{"operand1":10,"operator":"+","operand2":5,"result":15}'

# Delete all calculations
curl -X DELETE http://localhost:3006/api/calculations
```

### Database Verification
```sql
-- Check calculations
SELECT * FROM calculations ORDER BY timestamp DESC;

-- Count records
SELECT COUNT(*) as total FROM calculations;
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql
# or
brew services list | grep mysql

# Test connection
mysql -u root -p -h localhost
```

**Port Already in Use**
```bash
# Find process using port 3006
lsof -i :3006

# Kill process
kill -9 <PID>
```

**TypeScript Compilation Errors**
```bash
# Clean build
npm run clean && npm run build

# Type check only
npm run type-check
```

**Migration Issues**
```bash
# Use simple JavaScript migration
node migrate-simple.js

# Or manually create database
mysql -u root -p
CREATE DATABASE calculator_db;
```

## 📊 Monitoring & Logs

### Log Files (auto-created in `logs/` directory)
- `error.log` - Error-level logs only
- `combined.log` - All log levels
- Console output in development mode

### Health Monitoring
- `GET /api/health` - Full health check with database status
- `GET /api/ping` - Simple connectivity test
- Database connection pool monitoring

## 🚢 Production Deployment

### Environment Setup
```bash
# Production environment
NODE_ENV=production
LOG_LEVEL=warn

# Database optimization
DB_CONNECTION_LIMIT=20
DB_TIMEOUT=30000
```

### Process Management
```bash
# Using PM2 (recommended)
npm install -g pm2
npm run build
pm2 start dist/server.js --name calculator-api

# Using Docker
docker build -t calculator-backend .
docker run -p 3006:3006 calculator-backend
```

## 🤝 Integration

### Frontend Integration
- **CORS** configured for `http://localhost:3000`
- **JSON API** responses
- **Error handling** with proper HTTP status codes
- **Real-time** calculation verification

### Expected Frontend Flow
1. Frontend calls `POST /api/calculations` to save
2. Backend verifies calculation accuracy
3. Database stores verified calculation
4. Frontend calls `GET /api/calculations` for history
5. Frontend calls `DELETE /api/calculations` to clear all

## 📈 Performance

- **Connection Pooling** - Efficient database connections
- **Indexed Queries** - Optimized database performance
- **Minimal Dependencies** - Lightweight and fast
- **Async/Await** - Non-blocking operations
- **Error Boundaries** - Graceful failure handling

## 🎯 API Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "meta": {
    "total": number,
    "count": number
  },
  "timestamp": string
}
```

## 🔄 Version History

- **v1.0.0** - Initial release with complete CRUD operations
- Full calculation history management
- Database delete functionality
- Health monitoring endpoints
- Production-ready configuration

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Check log files in `logs/` directory
4. Test API endpoints manually
5. Verify database connectivity

---

**🎉 Your Calculator Backend is ready for production!**

Start with `npm run dev` and visit `http://localhost:3006/api/health` to verify everything is working.
