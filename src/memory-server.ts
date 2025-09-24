// Memory-based server with persistent data storage
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In-memory storage
let reviews: any[] = [];
let listings: any[] = [];

// Data file paths
const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files on startup
function loadData() {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
      reviews = JSON.parse(data);
      console.log(`📊 Loaded ${reviews.length} reviews from storage`);
    }
    
    if (fs.existsSync(LISTINGS_FILE)) {
      const data = fs.readFileSync(LISTINGS_FILE, "utf-8");
      listings = JSON.parse(data);
      console.log(`🏠 Loaded ${listings.length} listings from storage`);
    }
  } catch (error) {
    console.log("📝 No existing data found, starting fresh");
  }
}

// Save data to files
function saveData() {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));
    console.log("💾 Data saved to files");
  } catch (error) {
    console.error("❌ Failed to save data:", error);
  }
}

// Initialize with mock data if empty
function initializeMockData() {
  if (reviews.length === 0) {
    console.log("🔄 Initializing with mock data...");
    
    // Create listing
    const listing = {
      id: "listing-1",
      name: "2B N1 A - 29 Shoreditch Heights",
      external_ref: "2B N1 A - 29 Shoreditch Heights",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    listings.push(listing);
    
    // Create reviews
    const mockReviews = [
      {
        id: "hostaway:7453",
        listing_id: listing.id,
        channel: "hostaway",
        type: "host-to-guest",
        status: "published",
        rating: 5.0,
        rating_raw: 10,
        categories: {
          cleanliness: 5.0,
          communication: 5.0,
          respect_house_rules: 5.0
        },
        title: null,
        comment: "Shane and family are wonderful! Would definitely host again :)",
        author_name: "Shane Finkelstein",
        submitted_at: "2020-08-21T22:45:14.000Z",
        approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "hostaway:7454",
        listing_id: listing.id,
        channel: "hostaway",
        type: "host-to-guest",
        status: "published",
        rating: 4.0,
        rating_raw: 8,
        categories: {
          cleanliness: 4.5,
          communication: 5.0,
          location: 4.0,
          value: 3.5
        },
        title: null,
        comment: "Great location and clean apartment. The check-in process was smooth and the host was very responsive to our questions.",
        author_name: "Maria Rodriguez",
        submitted_at: "2020-09-15T14:30:22.000Z",
        approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "hostaway:7455",
        listing_id: listing.id,
        channel: "hostaway",
        type: "host-to-guest",
        status: "published",
        rating: 3.0,
        rating_raw: 6,
        categories: {
          cleanliness: 4.0,
          communication: 4.5,
          accuracy: 2.5,
          checkin: 3.5
        },
        title: null,
        comment: "The apartment was nice but there were some issues with the heating system. The host was quick to respond and tried to help, but we had to wait for maintenance.",
        author_name: "James Wilson",
        submitted_at: "2020-10-03T09:15:45.000Z",
        approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    reviews.push(...mockReviews);
    saveData();
  }
}

// API Routes
app.get("/health", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Memory server is running!",
    data: {
      reviews: reviews.length,
      listings: listings.length
    }
  });
});

// Required assessment endpoint
app.get("/api/reviews/hostaway", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 50;
  const approved = req.query.approved;
  const minRating = req.query.minRating;
  const listing = req.query.listing;
  
  let filteredReviews = [...reviews];
  
  // Apply filters
  if (approved !== undefined) {
    const isApproved = approved === "true";
    filteredReviews = filteredReviews.filter(r => r.approved === isApproved);
  }
  
  if (minRating !== undefined) {
    const min = parseFloat(minRating as string);
    filteredReviews = filteredReviews.filter(r => r.rating >= min);
  }
  
  if (listing !== undefined) {
    const listingId = listings.find(l => l.name === listing)?.id;
    if (listingId) {
      filteredReviews = filteredReviews.filter(r => r.listing_id === listingId);
    }
  }
  
  // Pagination
  const skip = (page - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(skip, skip + pageSize);
  
  // Format response
  const formattedReviews = paginatedReviews.map(review => {
    const listing = listings.find(l => l.id === review.listing_id);
    return {
      id: review.id,
      listingId: review.listing_id,
      listingName: listing?.name || "Unknown Listing",
      channel: review.channel,
      type: review.type,
      status: review.status,
      rating: review.rating,
      ratingRaw: review.rating_raw,
      categories: review.categories,
      title: review.title,
      comment: review.comment,
      authorName: review.author_name,
      submittedAt: review.submitted_at,
      approved: review.approved
    };
  });
  
  res.json({
    ok: true,
    page,
    pageSize,
    total: filteredReviews.length,
    items: formattedReviews
  });
});

// General reviews endpoint
app.get("/api/reviews", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 50;
  const approved = req.query.approved;
  const channel = req.query.channel;
  const search = req.query.q;
  
  let filteredReviews = [...reviews];
  
  // Apply filters
  if (approved !== undefined) {
    const isApproved = approved === "true";
    filteredReviews = filteredReviews.filter(r => r.approved === isApproved);
  }
  
  if (channel !== undefined) {
    filteredReviews = filteredReviews.filter(r => r.channel === channel);
  }
  
  if (search !== undefined) {
    const searchTerm = (search as string).toLowerCase();
    filteredReviews = filteredReviews.filter(r => 
      r.comment.toLowerCase().includes(searchTerm) ||
      r.author_name?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Pagination
  const skip = (page - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(skip, skip + pageSize);
  
  // Format response
  const formattedReviews = paginatedReviews.map(review => {
    const listing = listings.find(l => l.id === review.listing_id);
    return {
      id: review.id,
      listingId: review.listing_id,
      listingName: listing?.name || "Unknown Listing",
      channel: review.channel,
      type: review.type,
      status: review.status,
      rating: review.rating,
      ratingRaw: review.rating_raw,
      categories: review.categories,
      title: review.title,
      comment: review.comment,
      authorName: review.author_name,
      submittedAt: review.submitted_at,
      approved: review.approved
    };
  });
  
  res.json({
    ok: true,
    page,
    pageSize,
    total: filteredReviews.length,
    items: formattedReviews
  });
});

// Admin endpoint to approve/reject reviews
app.patch("/api/admin/reviews/:id/approve", (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  const adminKey = req.header("x-admin-key");
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  
  const review = reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ ok: false, error: "review_not_found" });
  }
  
  review.approved = approved;
  review.updated_at = new Date().toISOString();
  
  saveData();
  
  res.json({ 
    ok: true, 
    id: review.id, 
    approved: review.approved 
  });
});

// Property performance endpoints
app.get("/api/properties", (req, res) => {
  const propertiesWithStats = listings.map(listing => {
    const listingReviews = reviews.filter(r => r.listing_id === listing.id);
    const approvedReviews = listingReviews.filter(r => r.approved);
    const totalReviews = listingReviews.length;
    // Safe average rating calculation
    let totalRating = 0;
    let validRatings = 0;
    
    listingReviews.forEach(r => {
      const rating = parseFloat(String(r.rating || '0'));
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        totalRating += rating;
        validRatings++;
      }
    });
    
    const averageRating = validRatings > 0 ? totalRating / validRatings : 0;
    const approvalRate = totalReviews > 0 
      ? (approvedReviews.length / totalReviews) * 100 
      : 0;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = listingReviews.filter(r => 
      new Date(r.submitted_at) >= thirtyDaysAgo
    );

    return {
      id: listing.id,
      name: listing.name,
      address: listing.address,
      totalReviews,
      approvedReviews: approvedReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      approvalRate: Math.round(approvalRate),
      recentReviews: recentReviews.length,
      lastReviewDate: listingReviews.length > 0 
        ? listingReviews.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0].submitted_at
        : null
    };
  });

  res.json({ ok: true, properties: propertiesWithStats });
});

app.get("/api/properties/:id/performance", (req, res) => {
  const { id } = req.params;
  const listing = listings.find(l => l.id === id);
  if (!listing) {
    return res.status(404).json({ ok: false, error: "Property not found" });
  }

  const listingReviews = reviews.filter(r => r.listing_id === id);
  const approvedReviews = listingReviews.filter(r => r.approved);
  const totalReviews = listingReviews.length;
  // Safe average rating calculation
  let totalRating = 0;
  let validRatings = 0;
  
  listingReviews.forEach(r => {
    const rating = parseFloat(r.rating);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      totalRating += rating;
      validRatings++;
    }
  });
  
  const averageRating = validRatings > 0 ? totalRating / validRatings : 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = listingReviews.filter(r => {
        const reviewRating = parseFloat(String(r.rating || '0'));
      return !isNaN(reviewRating) && Math.round(reviewRating) === rating;
    }).length;
    
    return {
      rating,
      count,
      percentage: validRatings > 0 
        ? Math.round((count / validRatings) * 100)
        : 0
    };
  });

  res.json({
    ok: true,
    performance: {
      property: {
        id: listing.id,
        name: listing.name,
        address: listing.address
      },
      metrics: {
        totalReviews,
        approvedReviews: approvedReviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        approvalRate: totalReviews > 0 
          ? Math.round((approvedReviews.length / totalReviews) * 100)
          : 0
      },
      ratingDistribution
    }
  });
});

app.get("/api/analytics/overview", (req, res) => {
  const totalProperties = listings.length;
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(r => r.approved).length;
  // Safe average rating calculation
  let totalRating = 0;
  let validRatings = 0;
  
  reviews.forEach(r => {
    const rating = parseFloat(r.rating);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      totalRating += rating;
      validRatings++;
    }
  });
  
  const averageRating = validRatings > 0 ? totalRating / validRatings : 0;

  res.json({
    ok: true,
    overview: {
      summary: {
        totalProperties,
        totalReviews,
        approvedReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        approvalRate: totalReviews > 0 
          ? Math.round((approvedReviews / totalReviews) * 100)
          : 0
      }
    }
  });
});

// Seed Google reviews
app.post("/api/google/seed", (req, res) => {
  const googleReviews = [
    {
      id: "google:1",
      listing_id: listings[0]?.id,
      channel: "google",
      type: "public",
      status: "published",
      rating: 5.0,
      rating_raw: 5,
      categories: null,
      title: null,
      comment: "Amazing apartment with incredible views! The location is perfect and the host was very accommodating. Highly recommend!",
      author_name: "Alex Thompson",
      submitted_at: new Date("2021-06-15").toISOString(),
      approved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "google:2",
      listing_id: listings[0]?.id,
      channel: "google",
      type: "public",
      status: "published",
      rating: 4.0,
      rating_raw: 4,
      categories: null,
      title: null,
      comment: "Great stay overall. The apartment was clean and well-equipped. The location is excellent for exploring London. Only minor issue was the WiFi speed.",
      author_name: "Sophie Williams",
      submitted_at: new Date("2021-07-22").toISOString(),
      approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Add Google reviews
  googleReviews.forEach(review => {
    if (!reviews.find(r => r.id === review.id)) {
      reviews.push(review);
    }
  });
  
  saveData();
  
  res.json({ 
    ok: true, 
    message: "Google reviews seeded successfully",
    count: googleReviews.length
  });
});

// Initialize data
loadData();
initializeMockData();

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const baseUrl = process.env.BASE_URL || `${protocol}://${host}:${port}`;

app.listen(port, host, () => {
  console.log(`🚀 Memory server listening on ${host}:${port}`);
  console.log(`📊 Health check: ${baseUrl}/health`);
  console.log(`📋 API endpoint: ${baseUrl}/api/reviews/hostaway`);
  console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
  console.log(`🏠 Dashboard: ${baseUrl}/index.html`);
  console.log(`🏡 Property page: ${baseUrl}/property.html`);
  console.log(`💾 Data stored in: ${DATA_DIR}`);
  console.log(`📁 Reviews: ${reviews.length}, Listings: ${listings.length}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
