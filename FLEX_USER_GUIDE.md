# Flex Living Reviews Dashboard - Client User Guide

## 🚀 Quick Access URLs

### Frontend Applications
- **Manager Dashboard**: `http://localhost:3000/manager-dashboard.html`
- **Property Display Page**: `http://localhost:3000/property.html`
- **Google Reviews Integration**: `http://localhost:3000/google-reviews.html`

### Backend API Endpoints
- **Health Check**: `http://localhost:3000/health`
- **API Documentation**: `http://localhost:3000/api-docs`
- **API JSON Spec**: `http://localhost:3000/api-docs.json`

## 📋 Core API Endpoints

### Reviews Management
- **Get Hostaway Reviews**: `GET /api/reviews/hostaway`
- **Get All Reviews**: `GET /api/reviews`
- **Approve Review**: `PATCH /api/admin/reviews/{id}/approve`
- **Bulk Approve**: `PATCH /api/admin/reviews/bulk-approve`

### Properties & Analytics
- **List Properties**: `GET /api/properties`
- **Property Performance**: `GET /api/properties/{id}/performance`
- **Analytics Overview**: `GET /api/analytics/overview`
- **Property Comparison**: `GET /api/analytics/comparison?propertyIds=id1,id2`

### Google Reviews
- **Sync Google Reviews**: `POST /api/google/sync`
- **Get Google Reviews**: `GET /api/google/reviews`
- **Test Connection**: `GET /api/google/test?placeId={placeId}`

## 🔧 Setup Instructions

### 1. Start the Application
```bash
# Option 1: Memory Server (Recommended for Demo)
npm run dev

# Option 2: PostgreSQL Server (Production)
npm run dev-db
```

### 2. Access the Dashboard
1. Open browser to: `http://localhost:3000/manager-dashboard.html`
2. Click "Login" button in top-right corner
3. Enter admin key: `flex-admin`

## 📊 Using the Manager Dashboard

### Dashboard Features
- **Review Overview**: Total reviews, average ratings, trends
- **Property Selector**: Switch between properties or view all
- **Filtering**: By rating, date, approval status, channel, search
- **Bulk Operations**: Select multiple reviews for approval/rejection
- **Export**: CSV download of review data

### Key Actions
1. **Filter Reviews**: Use the filter panel to find specific reviews
2. **Approve Reviews**: Check reviews and click "Approve Selected"
3. **Export Data**: Click "Export CSV" to download review data
4. **Switch Properties**: Use dropdown to view property-specific reviews

## 🏠 Property Display Page

### Public-Facing Features
- **Approved Reviews Only**: Only shows approved reviews
- **Star Ratings**: Visual rating display with category breakdowns
- **Guest Information**: Names and submission dates
- **Responsive Design**: Works on mobile and desktop

### Access
- Direct URL: `http://localhost:3000/property.html`
- Displays reviews for all properties by default
- Can be embedded in your main website

## 🔍 Google Reviews Integration

### Setup Requirements
1. **Google Cloud Console**: Create project and enable Places API
2. **API Key**: Get Google Places API key
3. **Environment**: Add `GOOGLE_PLACES_API_KEY=your-key` to `.env` file

### Using Google Reviews
1. Access: `http://localhost:3000/google-reviews.html`
2. **Find Place ID**: Use Google Place ID Finder
3. **Test Connection**: Enter Place ID and test
4. **Sync Reviews**: Connect Place ID to your listing

### Example Place ID Test
```
GET http://localhost:3000/api/google/test?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4
```

## 🔐 Authentication

### Admin Access
- **Header**: `X-Admin-Key: your-admin-key`
- **Default Key**: `flex-admin`
- **Environment**: Set `ADMIN_KEY=your-key` in `.env`

### Protected Operations
- Review approval/rejection
- Bulk operations
- Analytics access
- Admin dashboard login

## 📱 API Usage Examples

### Get Hostaway Reviews (Assessment Endpoint)
```bash
curl "http://localhost:3000/api/reviews/hostaway?page=1&pageSize=50&listing=Shoreditch Heights"
```

### Approve a Review
```bash
curl -X PATCH "http://localhost:3000/api/admin/reviews/hostaway:7453/approve" \
  -H "X-Admin-Key: admin-secret-key-123" \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'
```

### Get Analytics Overview
```bash
curl "http://localhost:3000/api/analytics/overview"
```

### Sync Google Reviews
```bash
curl -X POST "http://localhost:3000/api/google/sync" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "listing-1",
    "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4"
  }'
```

## 🛠 Environment Configuration

### Required Environment Variables
```env
# Server
PORT=3000
HOST=localhost
NODE_ENV=development

# Database (for PostgreSQL mode)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=flex

# Security
ADMIN_KEY=admin-secret-key-123

# Google Integration
GOOGLE_PLACES_API_KEY=your-google-api-key
```

## 📊 Sample Data

### Test Properties
- **Property 1**: `2B N1 A - 29 Shoreditch Heights`
- **Property 2**: `2B N1 B - 30 Shoreditch Heights`

### Sample Reviews
- Hostaway reviews with ratings 3-5
- Category breakdowns (cleanliness, communication, etc.)
- Mixed approval status for testing

## 🚀 Deployment

### Production URLs (when deployed)
- **Manager Dashboard**: `https://your-domain.com/manager-dashboard.html`
- **Property Page**: `https://your-domain.com/property.html`
- **API Base**: `https://your-domain.com/api/`
- **Health Check**: `https://your-domain.com/health`

### Deployment Platforms
- **Recommended**: Vercel + Render (PostgreSQL)
- **Alternative**: Any Node.js hosting with PostgreSQL

## 🔧 Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change `PORT=3001` in `.env`
2. **Database connection**: Check PostgreSQL is running
3. **Admin login fails**: Verify `ADMIN_KEY` environment variable
4. **Google API errors**: Check API key and billing setup

### Debug Steps
1. Check health endpoint: `http://localhost:3000/health`
2. View API docs: `http://localhost:3000/api-docs`
3. Check server logs for error messages
4. Verify environment variables are set

---

## 📞 Support

For technical support or questions:
- Check the comprehensive documentation in `FLEX_REVIEWS_DOCUMENTATION.md`
- Review the README.md for detailed setup instructions
- Use the Swagger UI at `/api-docs` for API testing

**Ready to use!** The system is fully functional with sample data and ready for demonstration.
