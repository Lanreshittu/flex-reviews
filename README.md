# Flex Living Reviews Dashboard

A comprehensive reviews management system built for Flex Living's property management platform. This project includes a modern dashboard for managing guest reviews, API integration with Hostaway, and Google Reviews support.

## 🚀 Features

### Core Functionality
- **Hostaway Integration**: Normalized review data from Hostaway API (Assessment requirement)
- **Review Management**: Advanced filtering, pagination, and search capabilities
- **Admin Dashboard**: Review approval system with authentication
- **Google Reviews**: Integration support for Google Places API
- **Modern UI**: Clean, responsive dashboard interface
- **API Documentation**: Complete Swagger/OpenAPI documentation

### Technical Features
- **Dual Server Support**: Memory-based and PostgreSQL implementations
- **Data Persistence**: JSON file storage for memory server
- **Type Safety**: Full TypeScript implementation
- **RESTful API**: Well-documented endpoints
- **Health Monitoring**: Built-in health checks
- **Environment Configuration**: Flexible deployment options

### Advanced Features
- **Analytics Dashboard**: Cross-property performance metrics and insights
- **Property Performance**: Individual property analytics with trend analysis
- **Category Breakdown**: Detailed rating analysis by cleanliness, communication, etc.
- **Bulk Operations**: Bulk approve/reject reviews with selection
- **Export Functionality**: CSV export of review data
- **Real-time Filtering**: Live search and filter capabilities
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **React Components**: Modern property display page with React

## 📋 Assessment Requirements Met

✅ **Hostaway Integration (Mocked)**
- Integrated with Hostaway Reviews API
- Mock realistic review data
- Parse and normalize reviews by listing, type, channel, and date

✅ **Manager Dashboard**
- User-friendly, modern dashboard interface
- Per-property performance tracking
- Filter/sort by rating, category, channel, or time
- Trend analysis capabilities
- Review approval system

✅ **Review Display Page**
- Flex Living website property details layout
- Dedicated section for approved guest reviews
- Consistent design with property page style

✅ **Google Reviews (Exploration)**
- Basic integration implemented

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **TypeORM** for database operations
- **PostgreSQL** (optional) for production
- **Swagger/OpenAPI** for API documentation
- **Memory Server** with JSON file persistence
- **CORS** enabled for cross-origin requests

### Frontend
- **Vanilla JavaScript** with modern ES6+ (Manager Dashboard)
- **React 18** with JSX (Property Display Page)
- **Responsive Design** with CSS Grid/Flexbox
- **Tailwind CSS** for styling
- **Font Awesome** icons
- **Babel** for JSX compilation

### Development Tools
- **ts-node-dev** for development
- **ts-node** for TypeScript execution
- **TypeScript** with strict configuration
- **ESLint** for code quality
- **Prettier** for code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (optional, for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flex-reviews.git
   cd flex-reviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   # Memory server (recommended for development)
   npm run dev
   
   # PostgreSQL server (requires database setup)
   npm run dev-db
   ```

5. **Access the application**
   - Dashboard: http://localhost:3000/index.html
   - API Documentation: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

## 📚 API Documentation

### Core Endpoints

#### Health Check
```http
GET /health
```

#### Hostaway Reviews (Assessment Endpoint)
```http
GET /api/reviews/hostaway?page=1&pageSize=50&listing=property-name
```

#### All Reviews
```http
GET /api/reviews?approved=true&channel=hostaway&rating=4
```

#### Admin Operations
```http
PATCH /api/admin/reviews/{id}/approve
Headers: X-Admin-Key: your-admin-key
```

#### Google Reviews
```http
POST /api/google/sync
GET /api/google/reviews
GET /api/google/test?placeId={placeId}
```

#### Properties & Analytics
```http
GET /api/properties
GET /api/properties/{id}/performance
GET /api/properties/{id}/trends?period=30d
GET /api/analytics/overview
GET /api/analytics/comparison?propertyIds=id1,id2
GET /api/analytics/insights
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `pageSize` | integer | Items per page (default: 50) |
| `listing` | string | Filter by listing name |
| `listingId` | string | Filter by listing UUID |
| `rating` | integer | Filter by rating (1-5) |
| `minRating` | number | Filter by minimum rating |
| `approved` | boolean | Filter by approval status |
| `channel` | string | Filter by source (hostaway/google) |
| `q` | string | Search in comments |
| `from` | string | Filter from date (ISO format) |
| `to` | string | Filter to date (ISO format) |
| `sort` | string | Sort by: date_desc, rating_desc, rating_asc |
| `period` | string | Time period for trends: 7d, 30d, 90d, 1y |

## 🏗 Project Structure

```
flex-reviews/
├── src/
│   ├── controllers/     # API controllers
│   │   ├── admin.controller.ts      # Admin operations
│   │   ├── analytics.controller.ts  # Analytics & insights
│   │   ├── google.controller.ts    # Google Reviews integration
│   │   ├── hostaway.controller.ts   # Hostaway API (Assessment)
│   │   ├── property.controller.ts  # Property management
│   │   └── reviews.controller.ts   # Review operations
│   ├── services/        # Business logic
│   │   ├── analytics.service.ts    # Analytics calculations
│   │   ├── google.service.ts       # Google Places API
│   │   ├── hostaway.service.ts     # Hostaway data processing
│   │   ├── property.service.ts     # Property analytics
│   │   └── review.service.ts       # Review management
│   ├── routes/          # Express routes
│   │   ├── admin.routes.ts         # Admin endpoints
│   │   ├── analytics.routes.ts     # Analytics endpoints
│   │   ├── google.routes.ts       # Google Reviews
│   │   ├── hostaway.routes.ts     # Hostaway (Assessment)
│   │   ├── property.routes.ts     # Property endpoints
│   │   └── reviews.routes.ts      # Review endpoints
│   ├── entity/          # TypeORM entities
│   │   ├── Listing.ts             # Property listings
│   │   └── Review.ts               # Review data model
│   ├── lib/             # Utility functions
│   │   ├── filters.ts             # Query parsing
│   │   └── normalize.ts            # Data normalization
│   ├── server.ts        # PostgreSQL server
│   ├── memory-server.ts # Memory-based server
│   ├── data-source.ts   # Database configuration
│   └── swagger.config.ts # API documentation
├── public/              # Frontend files
│   ├── manager-dashboard.html     # Admin dashboard
│   ├── manager-dashboard.js       # Dashboard logic
│   ├── property.html              # Property display page
│   ├── property.js                # React components
│   ├── google-reviews.html        # Google integration
│   └── styles.css                 # Global styles
├── data/               # JSON data storage
│   ├── listings.json              # Property data
│   └── reviews.json               # Review data
├── swagger.json        # API documentation
└── README.md
```

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# Database (PostgreSQL)
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=flex

# Security
ADMIN_KEY=your-secret-admin-key
```

### Database Setup (PostgreSQL)

1. **Install PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create database**
   ```sql
   CREATE DATABASE flex;
   ```

3. **Update environment variables**
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DATABASE=flex
   ADMIN_KEY=your-secret-admin-key
   ```

4. **Database Schema (Auto-Generated)**
   - **No migrations required!** The app uses `synchronize: true`
   - TypeORM automatically creates tables based on entity definitions
   - Tables created: `reviews`, `listings`
   - Schema updates automatically on app restart

## 🚀 Deployment

### Option 1: Memory Server (Recommended for Development)
- No database setup required
- Data persisted in JSON files
- Perfect for demos and development
- Run: `npm run dev`

### Option 2: PostgreSQL Server (Production)
- Production-ready with database
- Full ACID compliance
- Run: `npm run dev-db` (development) or `npm run start` (production)
- Scalable architecture

### Deployment Platforms

#### Vercel (Recommended)
1. **Connect GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   ```
   POSTGRES_HOST=your-render-host
   POSTGRES_PORT=5432
   POSTGRES_USER=your-username
   POSTGRES_PASSWORD=your-password
   POSTGRES_DATABASE=flex
   ADMIN_KEY=your-secret-admin-key
   NODE_ENV=production
   ```
3. **Deploy automatically on git push**

#### Render (Database)
1. **Create PostgreSQL database on Render**
2. **Copy connection details to Vercel environment variables**
3. **Database automatically configured with SSL**

### Authentication Setup
- **Admin Key**: Set `ADMIN_KEY` environment variable
- **Dashboard Login**: Use the login modal in the dashboard
- **API Access**: Include `X-Admin-Key` header for protected endpoints

## 📊 Dashboard Features

### Manager Dashboard (`manager-dashboard.html`)
- **Review Overview**: Total reviews, average ratings, trends
- **Filtering**: By property, rating, date, approval status, channel
- **Search**: Full-text search in review comments
- **Approval System**: Approve/reject reviews for public display
- **Bulk Operations**: Select and approve multiple reviews
- **Export Functionality**: CSV export of review data
- **Analytics**: Performance metrics and insights
- **Property Selector**: Switch between properties or view all
- **Real-time Updates**: Live filtering and sorting

### Property Display Page (`property.html`)
- **React Components**: Modern, interactive interface
- **Public Reviews**: Only approved reviews shown
- **Responsive Design**: Mobile-friendly layout
- **Rating Display**: Star ratings and category breakdowns
- **Guest Information**: Names and submission dates
- **Featured Reviews**: Highlight top-rated reviews
- **Category Breakdown**: Detailed rating analysis
- **Property Details**: Amenities, location, policies
- **Image Gallery**: Property photos and descriptions

### Google Reviews Integration (`google-reviews.html`)
- **API Testing**: Test Google Places API connection
- **Review Syncing**: Sync Google reviews to database
- **Setup Guide**: Step-by-step configuration instructions
- **Review Management**: View and manage Google reviews

## 🔒 Security

- **Admin Authentication**: Secure admin key for review approval
- **Input Validation**: All inputs sanitized and validated
- **Environment Variables**: Sensitive data in environment files

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Get Hostaway reviews 
curl http://localhost:3000/api/reviews/hostaway

# Approve review (requires admin key)
curl -X PATCH http://localhost:3000/api/admin/reviews/review-id/approve \
  -H "X-Admin-Key: admin-secret-key-123" \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'

# Test Google Places API
curl "http://localhost:3000/api/google/test?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4"
```

### API Testing
- Use the Swagger UI at `/api-docs`
- Test all endpoints interactively
- View request/response schemas
- Interactive API documentation with examples

### Frontend Testing
- **Manager Dashboard**: http://localhost:3000/manager-dashboard.html
- **Property Display**: http://localhost:3000/property.html
- **Google Integration**: http://localhost:3000/google-reviews.html


## 🎯 Assessment Deliverables

✅ **Source Code**: Complete frontend and backend implementation
✅ **Running Version**: Local setup instructions provided
✅ **Documentation**: Comprehensive API and setup documentation
✅ **Tech Stack**: Node.js, TypeScript, Express, TypeORM, PostgreSQL
✅ **Design Decisions**: Modern UI/UX with responsive design
✅ **API Behaviors**: RESTful endpoints with proper error handling
✅ **Google Reviews**: Integration exploration and findings documented

## 🔍 Implementation Details

### Data Models
- **Listing Entity**: Properties with UUID primary keys, external references
- **Review Entity**: Comprehensive review data with categories, ratings, approval status
- **Normalization**: Hostaway 1-10 scale converted to 1-5 scale
- **Category Support**: Cleanliness, communication, location, value, etc.

### API Architecture
- **Controller-Service Pattern**: Clean separation of concerns
- **Route Organization**: Modular route definitions
- **Error Handling**: Comprehensive error responses
- **Authentication**: Admin key-based security
- **Validation**: Input sanitization and type checking

### Frontend Architecture
- **Vanilla JS Dashboard**: Modern ES6+ with class-based architecture
- **React Property Page**: Component-based with hooks
- **Responsive Design**: Mobile-first approach
- **State Management**: Local state with efficient updates
- **API Integration**: RESTful API consumption

### Data Processing
- **Hostaway Integration**: Mock data seeding and normalization
- **Google Reviews**: Places API integration with error handling
- **Analytics**: Complex calculations for insights and trends
- **Filtering**: Multi-dimensional filtering capabilities
- **Export**: CSV generation with proper formatting

