const { useState, useEffect } = React;

// API Configuration
const API_BASE = 'http://localhost:3000/api';

// Components
const StarRating = ({ rating, maxRating = 5 }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <i
        key={i}
        className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

const ReviewCard = ({ review, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      review.approved ? 'border-green-500' : 'border-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.authorName}</h3>
          <p className="text-sm text-gray-500">{review.listingName}</p>
          <p className="text-xs text-gray-400">{formatDate(review.submittedAt)}</p>
        </div>
        <div className="flex items-center space-x-2">
          {review.rating && (
            <div className="flex items-center space-x-1">
              <span className={`font-bold ${getRatingColor(review.rating)}`}>
                {review.rating}/5
              </span>
              <StarRating rating={review.rating} />
            </div>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            review.approved 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {review.approved ? 'Approved' : 'Pending'}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{review.comment}</p>

      {review.categories && Object.keys(review.categories).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Category Ratings:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(review.categories).map(([category, rating]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">{rating}/5</span>
                  <StarRating rating={rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {!review.approved && (
          <>
            <button
              onClick={() => onApprove(review.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <i className="fas fa-check mr-1"></i>
              Approve
            </button>
            <button
              onClick={() => onReject(review.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <i className="fas fa-times mr-1"></i>
              Reject
            </button>
          </>
        )}
        {review.approved && (
          <button
            onClick={() => onReject(review.id)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-undo mr-1"></i>
            Unapprove
          </button>
        )}
      </div>
    </div>
  );
};

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Status
          </label>
          <select
            value={filters.approved}
            onChange={(e) => onFilterChange('approved', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Reviews</option>
            <option value="true">Approved Only</option>
            <option value="false">Pending Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => onFilterChange('minRating', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Rating</option>
            <option value="5">5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="rating_asc">Lowest Rating</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Reviews
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Search in review comments..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

const StatsPanel = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <i className="fas fa-star text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <i className="fas fa-check text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="fas fa-clock text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <i className="fas fa-chart-line text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Avg Rating</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    averageRating: 0
  });
  const [filters, setFilters] = useState({
    approved: '',
    minRating: '',
    sort: 'date_desc',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '10',
        ...filters
      });

      const response = await fetch(`${API_BASE}/reviews?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.items || []);
      setTotalPages(Math.ceil(data.total / 10));
      
      // Calculate stats
      const allReviews = await fetch(`${API_BASE}/reviews?pageSize=1000`);
      const allData = await allReviews.json();
      const allItems = allData.items || [];
      
      setStats({
        total: allData.total || 0,
        approved: allItems.filter(r => r.approved).length,
        pending: allItems.filter(r => !r.approved).length,
        averageRating: allItems.reduce((sum, r) => sum + (r.rating || 0), 0) / allItems.length || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin-secret-key-123'
        },
        body: JSON.stringify({ approved: true })
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to approve review:', err);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'admin-secret-key-123'
        },
        body: JSON.stringify({ approved: false })
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to reject review:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flex Living Reviews Dashboard</h1>
              <p className="text-gray-600">Manage and approve guest reviews</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchReviews}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-refresh mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsPanel stats={stats} />
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">No reviews found matching your criteria.</p>
            </div>
          ) : (
            reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<Dashboard />, document.getElementById('root'));
