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
- Mock data for testing
- Documentation of findings

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **TypeORM** for database operations
- **PostgreSQL** (optional) for production
- **Swagger/OpenAPI** for API documentation

### Frontend
- **Vanilla JavaScript** with modern ES6+
- **Responsive Design** with CSS Grid/Flexbox
- **Chart.js** for data visualization
- **Tailwind CSS** for styling

### Development Tools
- **ts-node-dev** for development
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
POST /api/google/seed
GET /api/google/places/{placeId}
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `pageSize` | integer | Items per page (default: 50) |
| `listing` | string | Filter by listing name |
| `rating` | integer | Filter by rating (1-5) |
| `approved` | boolean | Filter by approval status |
| `channel` | string | Filter by source (hostaway/google) |
| `q` | string | Search in comments |

## 🏗 Project Structure

```
flex-reviews/
├── src/
│   ├── controllers/     # API controllers
│   ├── services/        # Business logic
│   ├── routes/          # Express routes
│   ├── entity/          # TypeORM entities
│   ├── lib/             # Utility functions
│   └── scripts/         # Database scripts
├── public/              # Frontend files
├── data/               # JSON data storage
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
2. **Create database**
   ```sql
   CREATE DATABASE flex;
   ```
3. **Update environment variables**
4. **Run migrations**
   ```bash
   npm run seed
   ```

## 🚀 Deployment

### Option 1: Memory Server (Recommended)
- No database setup required
- Data persisted in JSON files
- Perfect for demos and development

### Option 2: PostgreSQL Server
- Production-ready with database
- Full ACID compliance
- Scalable architecture

### Deployment Platforms

#### Heroku
```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set ADMIN_KEY=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Railway
```bash
# Connect to Railway
railway login
railway link

# Deploy
railway up
```

#### DigitalOcean App Platform
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

## 📊 Dashboard Features

### Manager Dashboard
- **Review Overview**: Total reviews, average ratings, trends
- **Filtering**: By property, rating, date, approval status
- **Search**: Full-text search in review comments
- **Approval System**: Approve/reject reviews for public display
- **Analytics**: Performance metrics and insights

### Property Display
- **Public Reviews**: Only approved reviews shown
- **Responsive Design**: Mobile-friendly layout
- **Rating Display**: Star ratings and category breakdowns
- **Guest Information**: Names and submission dates

## 🔒 Security

- **Admin Authentication**: Secure admin key for review approval
- **Input Validation**: All inputs sanitized and validated
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Sensitive data in environment files

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Get reviews
curl http://localhost:3000/api/reviews/hostaway

# Approve review (requires admin key)
curl -X PATCH http://localhost:3000/api/admin/reviews/review-id/approve \
  -H "X-Admin-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'
```

### API Testing
- Use the Swagger UI at `/api-docs`
- Test all endpoints interactively
- View request/response schemas

## 📈 Performance

- **Pagination**: Efficient data loading
- **Caching**: In-memory data storage
- **Optimized Queries**: Database query optimization
- **Lazy Loading**: Frontend performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact: dev@flexliving.com

## 🎯 Assessment Deliverables

✅ **Source Code**: Complete frontend and backend implementation
✅ **Running Version**: Local setup instructions provided
✅ **Documentation**: Comprehensive API and setup documentation
✅ **Tech Stack**: Node.js, TypeScript, Express, TypeORM, PostgreSQL
✅ **Design Decisions**: Modern UI/UX with responsive design
✅ **API Behaviors**: RESTful endpoints with proper error handling
✅ **Google Reviews**: Integration exploration and findings documented

---

**Built with ❤️ for Flex Living Assessment**