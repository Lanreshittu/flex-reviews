const { useState, useEffect } = React;

// API Configuration
const API_BASE = 'http://localhost:3000/api';

// Components
const StarRating = ({ rating, maxRating = 5, size = 'text-lg', showNumeric = false }) => {
  // Handle null/undefined ratings
  const safeRating = rating || 0;
  
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <i
        key={i}
        className={`fas fa-star ${i <= safeRating ? 'star-rating' : 'text-gray-300'} ${size}`}
      />
    );
  }
  return (
    <div className="flex items-center space-x-2">
      <div className="flex">{stars}</div>
      {showNumeric && (
        <span className="text-sm font-medium text-gray-600">{safeRating.toFixed(1)}</span>
      )}
    </div>
  );
};

const ReviewCard = ({ review, isFeatured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`review-card ${isFeatured ? 'featured' : ''}`}>
      {isFeatured && (
        <div className="flex items-center mb-3">
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            <i className="fas fa-star mr-1"></i>
            Featured Review
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.authorName}</h3>
          <p className="text-sm text-gray-500">{formatDate(review.submittedAt)}</p>
        </div>
        <div className="flex items-center space-x-2">
          {(review.rating && !isNaN(review.rating)) ? (
            <StarRating rating={parseFloat(review.rating)} size="text-lg" showNumeric={true} />
          ) : (
            <span className="text-sm text-gray-500 italic">No rating</span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {isExpanded ? review.comment : truncateText(review.comment)}
        {review.comment.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-green-600 hover:text-green-700 font-medium ml-1"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </p>

      {review.categories && Object.keys(review.categories).length > 0 && (
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(review.categories).map(([category, rating]) => (
              <span key={category} className="category-badge">
                {category.replace('_', ' ')}: {rating}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyHeader = ({ propertyName, averageRating, totalReviews }) => {
  return (
    <div className="header-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-4">{propertyName}</h1>
            <p className="text-green-100 text-xl">Premium accommodation in the heart of the city</p>
          </div>
          <div className="mt-8 md:mt-0 md:ml-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 text-center">
              {totalReviews > 0 ? (
                <>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                    <StarRating rating={Math.round(averageRating)} size="text-3xl" />
                  </div>
                  <p className="text-green-100 text-lg">Based on {totalReviews} guest reviews</p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <span className="text-4xl font-bold text-gray-300">--</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <i key={i} className="fas fa-star text-gray-300 text-3xl"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-green-100 text-lg">No reviews yet</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyDetails = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About This Property</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Experience luxury living in this beautifully designed 2-bedroom apartment 
                located in the vibrant Shoreditch Heights. This modern property offers 
                stunning city views and is perfectly positioned for both business and leisure travelers.
              </p>
              <p>
                The apartment features contemporary furnishings, a fully equipped kitchen, 
                and high-speed WiFi throughout. With excellent transport links and walking 
                distance to top attractions, it's the perfect base for your London stay.
              </p>
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-wifi text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-car text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">Parking Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-utensils text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">Kitchen</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-tv text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">Smart TV</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-bed text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">2 Bedrooms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-bath text-xl" style={{color: '#284E4C'}}></i>
                  <span className="text-gray-700 font-medium">2 Bathrooms</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-96">
              <div className="col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Modern apartment living room"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
                  alt="Modern kitchen"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80" 
                  alt="Modern bedroom"
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Modern 2-bedroom apartment in Shoreditch Heights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingBreakdown = ({ reviews }) => {
  const categories = ['cleanliness', 'communication', 'respect_house_rules', 'location', 'value'];
  
  const categoryStats = categories.map(category => {
    const categoryReviews = reviews.filter(r => r.categories && r.categories[category]);
    const averageRating = categoryReviews.length > 0
      ? categoryReviews.reduce((sum, r) => sum + (r.categories[category] || 0), 0) / categoryReviews.length
      : 0;
    
    return {
      category: category.replace('_', ' '),
      averageRating: Math.round((averageRating || 0) * 10) / 10,
      reviewCount: categoryReviews.length
    };
  });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Rating Breakdown</h3>
      <div className="space-y-4">
        {categoryStats.map(({ category, averageRating, reviewCount }) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium capitalize">{category}</span>
            <div className="flex items-center space-x-3">
              <div className="rating-bar w-24">
                <div 
                  className="rating-bar-fill" 
                  style={{ width: `${(averageRating / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-8">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = ({ reviews, loading, error, averageRating, totalReviews }) => {
  const [showAll, setShowAll] = useState(false);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [regularReviews, setRegularReviews] = useState([]);

  useEffect(() => {
    if (reviews.length > 0) {
      // Simulate featured reviews (top 2 by rating) with null safety
      const sortedReviews = [...reviews].sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      });
      setFeaturedReviews(sortedReviews.slice(0, 2));
      setRegularReviews(sortedReviews.slice(2));
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="section-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-green-600 mb-4"></i>
            <p className="text-gray-600 text-lg">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-3xl text-red-600 mb-4"></i>
            <p className="text-red-600 text-lg">Unable to load reviews at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayReviews = showAll ? regularReviews : regularReviews.slice(0, 3);

  return (
    <div className="section-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guest Reviews Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
          {totalReviews > 0 ? (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <StarRating rating={Math.round(averageRating)} size="text-2xl" showNumeric={true} />
              <span className="text-lg text-gray-600">from {totalReviews} reviews</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <i key={i} className="fas fa-star text-gray-300 text-2xl"></i>
                ))}
              </div>
              <span className="text-lg text-gray-500 italic">No reviews yet</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-comments text-6xl text-gray-300 mb-6"></i>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Reviews */}
            {featuredReviews.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Featured Reviews</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredReviews.map(review => (
                    <ReviewCard key={review.id} review={review} isFeatured={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Rating Breakdown */}
            <RatingBreakdown reviews={reviews} />

            {/* Regular Reviews */}
            {regularReviews.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">All Reviews</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {displayReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                
                {regularReviews.length > 3 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="btn-flex"
                    >
                      {showAll ? 'Show Less' : `See All ${regularReviews.length} Reviews`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  const propertyName = "2B N1 A - 29 Shoreditch Heights";

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/reviews?approved=true&pageSize=50`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        const approvedReviews = data.items || [];
        setReviews(approvedReviews);
        
        // Calculate average rating with null safety
        const ratings = approvedReviews.filter(r => r.rating && !isNaN(r.rating)).map(r => parseFloat(r.rating) || 0);
        const average = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
        
        setStats({
          averageRating: average,
          totalReviews: approvedReviews.length
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #284E4C, #1A3A38)'}}>
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Flex Living</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Navigation items can be added here in the future */}
            </div>
          </div>
        </div>
      </nav>

      {/* Property Header */}
      <PropertyHeader 
        propertyName={propertyName}
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
      />

      {/* Property Details */}
      <PropertyDetails />

      {/* Guest Reviews Section */}
      <ReviewsSection 
        reviews={reviews}
        loading={loading}
        error={error}
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
      />

      {/* Location & Policies Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Location</h2>
              <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <i className="fas fa-map-marked-alt text-4xl mb-4"></i>
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm mt-2">Shoreditch Heights, London</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Policies</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <i className="fas fa-clock text-xl mt-1" style={{color: '#284E4C'}}></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Check-in/out</h3>
                    <p className="text-gray-600">Check-in: 3:00 PM | Check-out: 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <i className="fas fa-ban text-xl mt-1" style={{color: '#284E4C'}}></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">No smoking</h3>
                    <p className="text-gray-600">This property is non-smoking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <i className="fas fa-paw text-xl mt-1" style={{color: '#284E4C'}}></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pets</h3>
                    <p className="text-gray-600">Pets allowed with prior approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #284E4C, #1A3A38)'}}>
                  <span className="text-white font-bold">F</span>
                </div>
                <h3 className="text-xl font-bold">Flex Living</h3>
              </div>
              <p className="text-gray-400">Premium accommodation for modern travelers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Properties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Flex Living. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

ReactDOM.render(<PropertyPage />, document.getElementById('root'));
