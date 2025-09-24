import { AppDataSource } from "../data-source";
import { Listing } from "../entities/Listing";
import { Review } from "../entities/Review";

export const AnalyticsService = {
  // Get cross-property analytics overview
  async getOverview() {
    const listingRepo = AppDataSource.getRepository(Listing);
    const reviewRepo = AppDataSource.getRepository(Review);

    const listings = await listingRepo.find();
    const allReviews = await reviewRepo.find();

    const totalProperties = listings.length;
    const totalReviews = allReviews.length;
    const approvedReviews = allReviews.filter(r => r.approved).length;
    // Safe average rating calculation
    let totalRating = 0;
    let validRatings = 0;
    
    allReviews.forEach(r => {
      const rating = parseFloat(String(r.rating || '0'));
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        totalRating += rating;
        validRatings++;
      }
    });
    
    const averageRating = validRatings > 0 ? totalRating / validRatings : 0;

    // Top performing properties
    const propertyStats = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await reviewRepo.find({ where: { listing_id: listing.id } });
        // Safe average rating calculation
        let totalRating = 0;
        let validRatings = 0;
        
        reviews.forEach(r => {
          const rating = parseFloat(String(r.rating || '0'));
          if (!isNaN(rating) && rating >= 0 && rating <= 5) {
            totalRating += rating;
            validRatings++;
          }
        });
        
        const averageRating = validRatings > 0 ? totalRating / validRatings : 0;
        const approvalRate = reviews.length > 0 
          ? (reviews.filter(r => r.approved).length / reviews.length) * 100 
          : 0;
        
        return {
          id: listing.id,
          name: listing.name,
          averageRating: Math.round(averageRating * 10) / 10,
          approvalRate: Math.round(approvalRate),
          reviewCount: reviews.length
        };
      })
    );

    const topPerformers = propertyStats
      .filter(p => p.reviewCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = allReviews.filter(r => 
      new Date(r.submitted_at) >= thirtyDaysAgo
    );

    // Category performance across all properties
    const categoryStats = this.calculateGlobalCategoryStats(allReviews);

    return {
      summary: {
        totalProperties,
        totalReviews,
        approvedReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        approvalRate: totalReviews > 0 
          ? Math.round((approvedReviews / totalReviews) * 100)
          : 0,
        recentActivity: recentReviews.length
      },
      topPerformers,
      categoryStats,
      recentTrends: this.calculateRecentTrends(allReviews)
    };
  },

  // Get performance comparison between properties
  async getPropertyComparison(propertyIds: string[]) {
    const reviewRepo = AppDataSource.getRepository(Review);
    const listingRepo = AppDataSource.getRepository(Listing);

    const comparisons = await Promise.all(
      propertyIds.map(async (id) => {
        const listing = await listingRepo.findOne({ where: { id } });
        const reviews = await reviewRepo.find({ where: { listing_id: id } });
        
        if (!listing || reviews.length === 0) {
          return {
            id,
            name: listing?.name || 'Unknown Property',
            metrics: null
          };
        }

        // Safe average rating calculation
        let totalRating = 0;
        let validRatings = 0;
        
        reviews.forEach(r => {
          const rating = parseFloat(String(r.rating || '0'));
          if (!isNaN(rating) && rating >= 0 && rating <= 5) {
            totalRating += rating;
            validRatings++;
          }
        });
        
        const averageRating = validRatings > 0 ? totalRating / validRatings : 0;
        const approvalRate = (reviews.filter(r => r.approved).length / reviews.length) * 100;
        const categoryStats = this.calculateCategoryStats(reviews);

        return {
          id,
          name: listing.name,
          metrics: {
            averageRating: Math.round(averageRating * 10) / 10,
            approvalRate: Math.round(approvalRate),
            totalReviews: reviews.length,
            categoryStats
          }
        };
      })
    );

    return {
      properties: comparisons,
      comparison: this.generateComparisonInsights(comparisons)
    };
  },

  // Get insights and recommendations
  async getInsights() {
    const reviewRepo = AppDataSource.getRepository(Review);
    const allReviews = await reviewRepo.find();

    const insights = [];

    // Volume insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = allReviews.filter(r => 
      new Date(r.submitted_at) >= thirtyDaysAgo
    );
    const previousPeriod = allReviews.filter(r => {
      const reviewDate = new Date(r.submitted_at);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      return reviewDate >= sixtyDaysAgo && reviewDate < thirtyDaysAgo;
    });

    if (recentReviews.length > previousPeriod.length) {
      insights.push({
        type: 'positive',
        message: `Review volume increased by ${recentReviews.length - previousPeriod.length} reviews this month`,
        action: 'Continue current strategies'
      });
    } else if (recentReviews.length < previousPeriod.length) {
      insights.push({
        type: 'warning',
        message: `Review volume decreased by ${previousPeriod.length - recentReviews.length} reviews this month`,
        action: 'Consider review request campaigns'
      });
    }

    // Rating insights - Safe average rating calculation
    let totalRating = 0;
    let validRatings = 0;
    
    allReviews.forEach(r => {
      const rating = parseFloat(String(r.rating || '0'));
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        totalRating += rating;
        validRatings++;
      }
    });
    
    const averageRating = validRatings > 0 ? totalRating / validRatings : 0;
    
    if (averageRating < 4.0) {
      insights.push({
        type: 'critical',
        message: `Overall average rating is ${Math.round(averageRating * 10) / 10}, below target`,
        action: 'Focus on improving guest experience'
      });
    } else if (averageRating >= 4.5) {
      insights.push({
        type: 'positive',
        message: `Excellent overall rating of ${Math.round(averageRating * 10) / 10}`,
        action: 'Maintain current standards'
      });
    }

    // Approval insights
    const approvalRate = allReviews.length > 0 
      ? (allReviews.filter(r => r.approved).length / allReviews.length) * 100 
      : 0;
    
    if (approvalRate < 60) {
      insights.push({
        type: 'warning',
        message: `Only ${Math.round(approvalRate)}% of reviews are approved for public display`,
        action: 'Review approval criteria and approve more high-quality reviews'
      });
    }

    // Category insights
    const categoryStats = this.calculateGlobalCategoryStats(allReviews);
    const lowestCategory = categoryStats.reduce((min, cat) => 
      cat.averageRating < min.averageRating ? cat : min
    );

    if (lowestCategory.averageRating < 4.0) {
      insights.push({
        type: 'warning',
        message: `${lowestCategory.category} ratings are lowest at ${lowestCategory.averageRating}`,
        action: `Focus on improving ${lowestCategory.category}`
      });
    }

    return {
      insights,
      recommendations: this.generateRecommendations(allReviews, categoryStats)
    };
  },

  // Helper methods
  calculateGlobalCategoryStats(reviews: any[]) {
    const categories = ['cleanliness', 'communication', 'respect_house_rules', 'location', 'value'];
    return categories.map(category => {
      const categoryReviews = reviews.filter(r => r.categories && r.categories[category]);
      const averageRating = categoryReviews.length > 0
        ? categoryReviews.reduce((sum, r) => sum + (r.categories[category] || 0), 0) / categoryReviews.length
        : 0;
      
      return {
        category,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: categoryReviews.length
      };
    });
  },

  calculateCategoryStats(reviews: any[]) {
    const categories = ['cleanliness', 'communication', 'respect_house_rules', 'location', 'value'];
    return categories.map(category => {
      const categoryReviews = reviews.filter(r => r.categories && r.categories[category]);
      const averageRating = categoryReviews.length > 0
        ? categoryReviews.reduce((sum, r) => sum + (r.categories[category] || 0), 0) / categoryReviews.length
        : 0;
      
      return {
        category,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: categoryReviews.length
      };
    });
  },

  calculateRecentTrends(reviews: any[]) {
    const now = new Date();
    const periods = [
      { name: 'Last 7 days', days: 7 },
      { name: 'Last 30 days', days: 30 },
      { name: 'Last 90 days', days: 90 }
    ];

    return periods.map(period => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period.days);
      
      const periodReviews = reviews.filter(r => 
        new Date(r.submitted_at) >= startDate
      );
      
      // Safe average rating calculation
      let totalRating = 0;
      let validRatings = 0;
      
      periodReviews.forEach(r => {
        const rating = parseFloat(String(r.rating || '0'));
        if (!isNaN(rating) && rating >= 0 && rating <= 5) {
          totalRating += rating;
          validRatings++;
        }
      });
      
      const averageRating = validRatings > 0 ? totalRating / validRatings : 0;
      
      return {
        period: period.name,
        reviewCount: periodReviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        approvalRate: periodReviews.length > 0
          ? Math.round((periodReviews.filter(r => r.approved).length / periodReviews.length) * 100)
          : 0
      };
    });
  },

  generateComparisonInsights(comparisons: any[]) {
    const validComparisons = comparisons.filter(c => c.metrics);
    if (validComparisons.length < 2) return [];

    const insights = [];
    
    // Find best and worst performers
    const sortedByRating = [...validComparisons].sort((a, b) => 
      b.metrics.averageRating - a.metrics.averageRating
    );
    
    const best = sortedByRating[0];
    const worst = sortedByRating[sortedByRating.length - 1];
    
    if (best.metrics.averageRating - worst.metrics.averageRating > 0.5) {
      insights.push({
        type: 'info',
        message: `${best.name} has the highest rating (${best.metrics.averageRating})`,
        action: 'Learn from top performer strategies'
      });
    }

    return insights;
  },

  generateRecommendations(reviews: any[], categoryStats: any[]) {
    const recommendations = [];
    
    // Low approval rate recommendation
    const approvalRate = reviews.length > 0 
      ? (reviews.filter(r => r.approved).length / reviews.length) * 100 
      : 0;
    
    if (approvalRate < 70) {
      recommendations.push({
        priority: 'high',
        title: 'Increase Review Approval Rate',
        description: `Current approval rate is ${Math.round(approvalRate)}%. Consider approving more 4+ star reviews.`,
        action: 'Review and approve high-quality reviews'
      });
    }

    // Category improvement recommendations
    const lowCategories = categoryStats.filter(cat => cat.averageRating < 4.0);
    lowCategories.forEach(category => {
      recommendations.push({
        priority: 'medium',
        title: `Improve ${category.category} Ratings`,
        description: `${category.category} has an average rating of ${category.averageRating}`,
        action: `Focus on ${category.category} improvements`
      });
    });

    return recommendations;
  }
};
