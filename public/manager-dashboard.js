// Enhanced Flex Living Reviews Dashboard
class FlexReviewsDashboard {
    constructor() {
        this.apiBase = window.location.origin;
        this.currentProperty = null;
        this.reviews = [];
        this.properties = [];
        this.filters = {
            search: '',
            rating: '',
            status: '',
            channel: '',
            dateRange: '',
            sortBy: 'newest'
        };
        this.selectedReviews = new Set();
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProperties();
        await this.loadAnalytics();
        await this.loadReviews();
    }

    setupEventListeners() {
        // Property selector
        document.getElementById('propertySelector').addEventListener('change', (e) => {
            this.currentProperty = e.target.value;
            if (this.currentProperty) {
                this.loadPropertyPerformance();
            } else {
                this.loadAnalytics(); // Show overall analytics when "All Properties" is selected
            }
            this.loadReviews();
        });

        // Filter inputs
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        document.getElementById('ratingFilter').addEventListener('change', (e) => {
            this.filters.rating = e.target.value;
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('channelFilter').addEventListener('change', (e) => {
            this.filters.channel = e.target.value;
            this.applyFilters();
        });

        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.applyFilters();
        });

        // Action buttons
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('bulkApprove').addEventListener('click', () => {
            this.bulkApprove();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    async loadProperties() {
        try {
            const response = await fetch(`${this.apiBase}/api/properties`);
            const data = await response.json();
            
            if (data.ok) {
                this.properties = data.properties;
                this.populatePropertySelector();
            }
        } catch (error) {
            console.error('Error loading properties:', error);
        }
    }

    populatePropertySelector() {
        const selector = document.getElementById('propertySelector');
        selector.innerHTML = '<option value="">All Properties</option>';
        
        this.properties.forEach(property => {
            const option = document.createElement('option');
            option.value = property.id;
            option.textContent = property.name;
            selector.appendChild(option);
        });
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`${this.apiBase}/api/analytics/overview`);
            const data = await response.json();
            
            if (data.ok) {
                this.displayAnalyticsOverview(data.overview);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    displayAnalyticsOverview(overview) {
        const container = document.getElementById('performanceOverview');
        const { summary } = overview;

        container.innerHTML = `
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Total Properties</h3>
                    <div class="card-icon rating">🏠</div>
                </div>
                <div class="card-value">${summary.totalProperties}</div>
                <div class="card-label">Active Properties</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Total Reviews</h3>
                    <div class="card-icon reviews">📝</div>
                </div>
                <div class="card-value">${summary.totalReviews}</div>
                <div class="card-label">All Time Reviews</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Average Rating</h3>
                    <div class="card-icon rating">⭐</div>
                </div>
                <div class="card-value">${summary.averageRating}</div>
                <div class="card-label">Overall Rating</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Approval Rate</h3>
                    <div class="card-icon approval">✅</div>
                </div>
                <div class="card-value">${summary.approvalRate}%</div>
                <div class="card-label">Reviews Approved</div>
            </div>
        `;
    }

    async loadPropertyPerformance() {
        if (!this.currentProperty) return;

        try {
            const response = await fetch(`${this.apiBase}/api/properties/${this.currentProperty}/performance`);
            const data = await response.json();
            
            if (data.ok) {
                this.displayPropertyPerformance(data.performance);
            }
        } catch (error) {
            console.error('Error loading property performance:', error);
        }
    }

    displayPropertyPerformance(performance) {
        const container = document.getElementById('performanceOverview');
        const { metrics, ratingDistribution } = performance;

        container.innerHTML = `
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Total Reviews</h3>
                    <div class="card-icon reviews">📝</div>
                </div>
                <div class="card-value">${metrics.totalReviews}</div>
                <div class="card-label">${performance.property.name}</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Average Rating</h3>
                    <div class="card-icon rating">⭐</div>
                </div>
                <div class="card-value">${metrics.averageRating}</div>
                <div class="card-label">Overall Rating</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Approval Rate</h3>
                    <div class="card-icon approval">✅</div>
                </div>
                <div class="card-value">${metrics.approvalRate}%</div>
                <div class="card-label">Reviews Approved</div>
            </div>
            
            <div class="performance-card">
                <div class="card-header">
                    <h3 class="card-title">Rating Distribution</h3>
                    <div class="card-icon trend">📊</div>
                </div>
                <div class="card-value">${ratingDistribution[0]?.percentage || 0}%</div>
                <div class="card-label">5-Star Reviews</div>
            </div>
        `;
    }

    async loadReviews() {
        try {
            this.showLoading();
            
            let url = `${this.apiBase}/api/reviews`;
            const params = new URLSearchParams();
            
            if (this.currentProperty) {
                params.append('listing', this.currentProperty);
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (data.ok) {
                this.reviews = data.reviews || data.items || [];
                this.applyFilters(); // Apply filters after loading
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showError('Failed to load reviews');
        } finally {
            this.hideLoading();
        }
    }

    renderReviews(reviewsToShow = this.reviews) {
        const container = document.getElementById('reviewsTableContainer');
        
        if (reviewsToShow.length === 0) {
            const hasActiveFilters = Object.values(this.filters).some(value => value !== '' && value !== 'newest');
            const message = hasActiveFilters 
                ? 'No reviews match your current filters. Try adjusting your search criteria.'
                : 'No reviews found';
            
            container.innerHTML = `
                <div class="text-center p-6">
                    <div class="text-gray-500">${message}</div>
                    ${hasActiveFilters ? '<button onclick="dashboard.clearFilters()" class="btn btn-secondary btn-sm mt-2">Clear Filters</button>' : ''}
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="reviews-table">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" id="selectAll" onchange="dashboard.toggleSelectAll(this.checked)">
                        </th>
                        <th>Property</th>
                        <th>Guest</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Channel</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reviewsToShow.map(review => this.renderReviewRow(review)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    renderReviewRow(review) {
        const statusClass = review.approved ? 'status-approved' : 'status-pending';
        const statusText = review.approved ? 'Approved' : 'Pending';
        
        return `
            <tr>
                <td>
                    <input type="checkbox" 
                           value="${review.id}" 
                           onchange="dashboard.toggleReviewSelection('${review.id}', this.checked)">
                </td>
                <td>${review.listingName || 'Unknown'}</td>
                <td>${review.authorName || review.guestName || 'Anonymous'}</td>
                <td>
                    <div class="rating">
                        <div class="rating-stars">
                            ${this.renderStars(review.rating)}
                        </div>
                        <span class="rating-value">${review.rating}</span>
                    </div>
                </td>
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${review.comment || review.title || 'No comment'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <span class="text-sm">${review.channel || 'Unknown'}</span>
                </td>
                <td>
                    <span class="text-sm">${this.formatDate(review.submittedAt)}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${!review.approved ? 
                            `<button class="btn-approve" onclick="dashboard.approveReview('${review.id}')">Approve</button>` : 
                            `<button class="btn-reject" onclick="dashboard.rejectReview('${review.id}')">Reject</button>`
                        }
                    </div>
                </td>
            </tr>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        
        if (hasHalfStar) {
            stars += '<span class="star filled">☆</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">★</span>';
        }
        
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    applyFilters() {
        const filteredReviews = this.reviews.filter(review => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const matchesSearch = 
                    review.comment?.toLowerCase().includes(searchTerm) ||
                    review.author_name?.toLowerCase().includes(searchTerm) ||
                    review.title?.toLowerCase().includes(searchTerm);
                if (!matchesSearch) return false;
            }

            // Rating filter
            if (this.filters.rating) {
                const rating = Math.round(review.rating);
                if (rating.toString() !== this.filters.rating) return false;
            }

            // Status filter
            if (this.filters.status) {
                if (this.filters.status === 'approved' && !review.approved) return false;
                if (this.filters.status === 'pending' && review.approved) return false;
            }

            // Channel filter
            if (this.filters.channel) {
                if (review.channel !== this.filters.channel) return false;
            }

            // Date range filter
            if (this.filters.dateRange) {
                const reviewDate = new Date(review.submitted_at);
                
                // Check if the date is valid
                if (isNaN(reviewDate.getTime())) {
                    return false; // Skip invalid dates
                }
                
                const now = new Date();
                
                // Parse the date range (e.g., "7d", "30d", "90d", "365d", "1825d")
                const daysAgo = parseInt(this.filters.dateRange.replace('d', ''));
                const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
                
                // Only include reviews from the cutoff date onwards
                if (reviewDate < cutoffDate) return false;
            }

            return true;
        });

        // Sort filtered reviews
        const sortedReviews = this.sortReviews(filteredReviews, this.filters.sortBy);
        
        // Update filter results count
        this.updateFilterResultsCount(sortedReviews.length);
        
        this.renderReviews(sortedReviews);
    }

    updateFilterResultsCount(count) {
        const resultsElement = document.getElementById('filterResults');
        if (resultsElement) {
            resultsElement.textContent = `Showing ${count} of ${this.reviews.length} reviews`;
        }
    }

    sortReviews(reviews, sortBy) {
        return reviews.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.submitted_at) - new Date(a.submitted_at);
                case 'oldest':
                    return new Date(a.submitted_at) - new Date(b.submitted_at);
                case 'rating-high':
                    return b.rating - a.rating;
                case 'rating-low':
                    return a.rating - b.rating;
                case 'author':
                    return (a.author_name || '').localeCompare(b.author_name || '');
                default:
                    return 0;
            }
        });
    }

    clearFilters() {
        // Reset form inputs
        document.getElementById('searchInput').value = '';
        document.getElementById('ratingFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('channelFilter').value = '';
        document.getElementById('dateFilter').value = '';
        document.getElementById('sortBy').value = 'newest';
        
        // Reset filters object
        this.filters = {
            search: '',
            rating: '',
            status: '',
            channel: '',
            dateRange: '',
            sortBy: 'newest'
        };
        
        // Reapply filters (which will show all reviews)
        this.applyFilters();
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][value]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            this.toggleReviewSelection(checkbox.value, checked);
        });
    }

    toggleReviewSelection(reviewId, selected) {
        if (selected) {
            this.selectedReviews.add(reviewId);
        } else {
            this.selectedReviews.delete(reviewId);
        }
    }

    async approveReview(reviewId) {
        try {
            const response = await fetch(`${this.apiBase}/api/admin/reviews/${reviewId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': 'admin-secret-key-123'
                },
                body: JSON.stringify({ approved: true })
            });

            if (response.ok) {
                this.showSuccess('Review approved successfully');
                this.loadReviews();
            } else {
                this.showError('Failed to approve review');
            }
        } catch (error) {
            console.error('Error approving review:', error);
            this.showError('Failed to approve review');
        }
    }

    async rejectReview(reviewId) {
        try {
            const response = await fetch(`${this.apiBase}/api/admin/reviews/${reviewId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': 'admin-secret-key-123'
                },
                body: JSON.stringify({ approved: false })
            });

            if (response.ok) {
                this.showSuccess('Review rejected successfully');
                this.loadReviews();
            } else {
                this.showError('Failed to reject review');
            }
        } catch (error) {
            console.error('Error rejecting review:', error);
            this.showError('Failed to reject review');
        }
    }

    async bulkApprove() {
        if (this.selectedReviews.size === 0) {
            this.showError('Please select reviews to approve');
            return;
        }

        try {
            const promises = Array.from(this.selectedReviews).map(reviewId => 
                this.approveReview(reviewId)
            );
            
            await Promise.all(promises);
            this.selectedReviews.clear();
            this.showSuccess(`${this.selectedReviews.size} reviews approved successfully`);
            this.loadReviews();
        } catch (error) {
            console.error('Error bulk approving reviews:', error);
            this.showError('Failed to approve some reviews');
        }
    }

    exportToCSV() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flex-living-reviews.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCSV() {
        const headers = ['Property', 'Guest', 'Rating', 'Comment', 'Status', 'Channel', 'Date'];
        const rows = this.reviews.map(review => [
            review.listingName || 'Unknown',
            review.authorName || review.guestName || 'Anonymous',
            review.rating,
            `"${(review.comment || review.title || '').replace(/"/g, '""')}"`,
            review.approved ? 'Approved' : 'Pending',
            review.channel || 'Unknown',
            this.formatDate(review.submittedAt)
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    async refreshData() {
        await this.loadProperties();
        await this.loadAnalytics();
        await this.loadReviews();
        this.showSuccess('Data refreshed successfully');
    }

    showLoading() {
        const container = document.getElementById('reviewsTableContainer');
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span>Loading reviews...</span>
            </div>
        `;
    }

    hideLoading() {
        // Loading is hidden when content is displayed
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Simple notification - you could enhance this with a proper notification system
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FlexReviewsDashboard();
});
