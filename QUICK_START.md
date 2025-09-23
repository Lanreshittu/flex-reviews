# 🚀 Quick Start Guide - Flex Living Reviews Dashboard

## Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Database
Create a PostgreSQL database named `flex` and update the `env` file with your credentials.

## 3. Seed Initial Data
```bash
npm run seed
```

## 4. Start the Server
```bash
npm run dev
```

## 5. Access the Application

### Manager Dashboard
Open: http://localhost:3000/index.html

Features:
- View all reviews with filtering
- Approve/reject reviews
- Real-time statistics
- Search and sort functionality

### Public Property Page
Open: http://localhost:3000/property.html

Features:
- Property information
- Approved reviews display
- Star ratings and categories
- Responsive design

## 6. Test the API

### Required Assessment Endpoint
```bash
curl "http://localhost:3000/api/reviews/hostaway"
```

### Additional Endpoints
```bash
# Get all reviews
curl "http://localhost:3000/api/reviews"

# Approve a review (requires admin key)
curl -X PATCH "http://localhost:3000/api/admin/reviews/hostaway:7453/approve" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: admin-secret-key-123" \
  -d '{"approved": true}'

# Seed Google reviews
curl -X POST "http://localhost:3000/api/google/seed"
```

## 🎯 Assessment Requirements Met

✅ **Hostaway Integration**: Mocked with realistic data  
✅ **Manager Dashboard**: Modern, intuitive interface  
✅ **Review Display**: Public-facing property page  
✅ **Google Reviews**: Mock integration ready for real API  
✅ **API Endpoint**: `GET /api/reviews/hostaway` returns structured data  
✅ **Documentation**: Comprehensive setup and usage guide  

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `env` file
- Verify database exists: `CREATE DATABASE flex;`

### Port Already in Use
- Change PORT in `env` file
- Or kill process using port 3000: `lsof -ti:3000 | xargs kill -9`

### Frontend Not Loading
- Ensure server is running on correct port
- Check browser console for errors
- Verify API endpoints are accessible

## 📞 Support
Check the main README.md for detailed documentation and API reference.
