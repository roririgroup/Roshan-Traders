# Super Admin Dashboard Backend Setup Guide

This guide provides the complete backend implementation for the Super Admin dashboard functionality including manufacturers, agents, and products management.

## Overview

The backend has been updated to properly handle CRUD operations for:
- **Products**: Create, read, update, delete products with proper field mappings
- **Agents**: Create, read, update, delete agents with user profile integration
- **Manufacturers**: Create, read, update, delete manufacturers with complex relations

## Database Schema

The Prisma schema includes comprehensive models for:
- Users and UserProfiles
- Agents with approval system
- Manufacturers with detailed company information
- Products with manufacturer relationships
- Complex relations for specializations, achievements, certifications

## Key Fixes Implemented

### 1. Product Service (`server/src/modules/product/product.service.js`)

**Fixed Issues:**
- ✅ Added `priceAmount` field mapping for frontend compatibility
- ✅ Fixed `image` field mapping (from `imageUrl`)
- ✅ Proper JSON handling for `paymentOptions`
- ✅ Better ID generation using crypto
- ✅ Response transformation for all CRUD operations

**API Endpoints:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### 2. Agent Service (`server/src/modules/agent/agent.service.js`)

**Fixed Issues:**
- ✅ Proper field mapping for frontend expectations
- ✅ User and UserProfile integration
- ✅ Status mapping (`isApproved` → `active`/`inactive`)
- ✅ Response transformation for all operations
- ✅ Proper error handling

**API Endpoints:**
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### 3. Manufacturer Service (`server/src/modules/manufacturer/manufacturer.service.js`)

**Fixed Issues:**
- ✅ Fixed database connection import
- ✅ Complex relation handling (specializations, achievements, certifications)
- ✅ Response transformation with flattened arrays
- ✅ Proper nested data handling
- ✅ User creation integration

**API Endpoints:**
- `GET /api/manufacturers` - Get all manufacturers
- `GET /api/manufacturers/:id` - Get manufacturer by ID
- `POST /api/manufacturers` - Create new manufacturer
- `PUT /api/manufacturers/:id` - Update manufacturer
- `DELETE /api/manufacturers/:id` - Delete manufacturer

## Field Mappings

### Products
```javascript
// Frontend expects:
{
  id: "string",
  name: "string",
  priceAmount: "number",    // ← Mapped from priceRange
  image: "string",          // ← Mapped from imageUrl
  paymentOptions: "array",  // ← Parsed from JSON string
  // ... other fields
}
```

### Agents
```javascript
// Frontend expects:
{
  id: "number",
  name: "string",           // ← From user.profile.fullName
  phone: "string",          // ← From user.phoneNumber
  email: "string",          // ← From user.profile.email
  location: "string",       // ← From assignedArea
  status: "active|inactive", // ← From isApproved
  image: "string",          // ← From user.profile.profileImageUrl
  // ... other fields
}
```

### Manufacturers
```javascript
// Frontend expects:
{
  id: "number",
  companyName: "string",
  specializationsList: "array",    // ← Flattened from relations
  achievementsList: "array",       // ← Flattened from relations
  certificationsList: "array",     // ← Flattened from relations
  // ... other fields
}
```

## Setup Instructions

### 1. Database Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed database with test data
npx prisma db seed
```

### 2. Environment Variables
Create a `.env` file in the server directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/roshan_traders"
APP_HOST="localhost"
APP_PORT=7700
```

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing the APIs

### Test Products API
```bash
# Get all products
curl http://localhost:7700/api/products

# Create a product
curl -X POST http://localhost:7700/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "priceRange": "100",
    "imageUrl": "https://example.com/image.jpg",
    "description": "Test product description",
    "qualityRating": 4.5,
    "paymentOptions": ["UPI", "Card"]
  }'
```

### Test Agents API
```bash
# Get all agents
curl http://localhost:7700/api/agents

# Create an agent
curl -X POST http://localhost:7700/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "location": "New York",
    "status": "active"
  }'
```

### Test Manufacturers API
```bash
# Get all manufacturers
curl http://localhost:7700/api/manufacturers

# Create a manufacturer
curl -X POST http://localhost:7700/api/manufacturers \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Manufacturing Co",
    "location": "California",
    "contact": {
      "phone": "+1234567890",
      "email": "contact@testco.com"
    }
  }'
```

## Frontend Integration

The backend now properly supports all frontend operations:

1. **Products Page**: Add, edit, delete products with proper field mappings
2. **Agents Page**: Add, edit, delete agents with user profile integration
3. **Manufacturers Page**: Add, edit, delete manufacturers with complex data handling

## Error Handling

All endpoints include proper error handling:
- 404 errors for not found resources
- 500 errors for server issues
- Proper error messages in responses
- Database constraint validation

## Security Considerations

- Input validation on all endpoints
- SQL injection protection via Prisma
- Proper error handling without exposing sensitive information
- CORS configuration for frontend integration

## Performance Optimizations

- Efficient database queries with proper includes
- Response transformation to minimize data transfer
- Proper indexing on frequently queried fields
- Connection pooling via Prisma

## Next Steps

1. Add authentication middleware for admin routes
2. Implement audit logging for all CRUD operations
3. Add data validation middleware
4. Implement rate limiting
5. Add comprehensive API documentation with Swagger

The backend is now fully functional and ready to support the Super Admin dashboard operations!
