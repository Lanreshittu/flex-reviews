const { useState, useEffect } = React;

// API Configuration
const API_BASE = 'http://localhost:3000/api';

// Components
const StarRating = ({ rating, maxRating = 5, size = 'text-lg' }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <i
        key={i}
        className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} ${size}`}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.authorName}</h3>
          <p className="text-sm text-gray-500">{formatDate(review.submittedAt)}</p>
        </div>
        {review.rating && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">{review.rating}/5</span>
            <StarRating rating={review.rating} size="text-xl" />
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {review.categories && Object.keys(review.categories).length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Detailed Ratings:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(review.categories).map(([category, rating]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{rating}/5</span>
                  <StarRating rating={rating} size="text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyHeader = ({ propertyName, averageRating, totalReviews }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{propertyName}</h1>
            <p className="text-blue-100 text-lg">Premium accommodation in the heart of the city</p>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <StarRating rating={Math.round(averageRating)} size="text-2xl" />
              </div>
              <p className="text-blue-100">Based on {totalReviews} guest reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyDetails = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Property</h2>
            <div className="space-y-4 text-gray-700">
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
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-wifi text-blue-600"></i>
                  <span className="text-gray-700">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-car text-blue-600"></i>
                  <span className="text-gray-700">Parking Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-utensils text-blue-600"></i>
                  <span className="text-gray-700">Kitchen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-tv text-blue-600"></i>
                  <span className="text-gray-700">Smart TV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-bed text-blue-600"></i>
                  <span className="text-gray-700">2 Bedrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-bath text-blue-600"></i>
                  <span className="text-gray-700">2 Bathrooms</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <i className="fas fa-image text-4xl mb-2"></i>
                <p>Property Image Gallery</p>
                <p className="text-sm">(Images would be displayed here)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-2xl text-red-600 mb-4"></i>
            <p className="text-red-600">Unable to load reviews at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
          <p className="text-gray-600">See what our guests have to say about their stay</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-comments text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">No reviews available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
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
        
        // Calculate average rating
        const ratings = approvedReviews.filter(r => r.rating).map(r => r.rating);
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Flex Living</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="index.html" className="text-gray-600 hover:text-gray-900">
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </a>
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

      {/* Reviews Section */}
      <ReviewsSection 
        reviews={reviews}
        loading={loading}
        error={error}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Flex Living</h3>
            <p className="text-gray-400">Premium accommodation for modern travelers</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

ReactDOM.render(<PropertyPage />, document.getElementById('root'));
