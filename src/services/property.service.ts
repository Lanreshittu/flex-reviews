import { AppDataSource } from "../data-source";
import { Listing } from "../entities/Listing";
import { Review } from "../entities/Review";

export const PropertyService = {
  // Get all properties with summary stats
  async getAllProperties() {
    const listingRepo = AppDataSource.getRepository(Listing);
    const reviewRepo = AppDataSource.getRepository(Review);

    const listings = await listingRepo.find();
    
    const propertiesWithStats = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await reviewRepo.find({
          where: { listing_id: listing.id }
        });

        const approvedReviews = reviews.filter(r => r.approved);
        const totalReviews = reviews.length;
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
        const approvalRate = totalReviews > 0 
          ? (approvedReviews.length / totalReviews) * 100 
          : 0;

        // Recent reviews (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentReviews = reviews.filter(r => 
          new Date(r.submitted_at) >= thirtyDaysAgo
        );

        // Category breakdown
        const categoryStats = this.calculateCategoryStats(reviews);

        return {
          id: listing.id,
          name: listing.name,
          totalReviews,
          approvedReviews: approvedReviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          approvalRate: Math.round(approvalRate),
          recentReviews: recentReviews.length,
          categoryStats,
          lastReviewDate: reviews.length > 0 
            ? reviews.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0]?.submitted_at || null
            : null
        };
      })
    );

    return propertiesWithStats;
  },

  // Get detailed performance metrics for a property
  async getPropertyPerformance(propertyId: string) {
    const listingRepo = AppDataSource.getRepository(Listing);
    const reviewRepo = AppDataSource.getRepository(Review);

    const listing = await listingRepo.findOne({ where: { id: propertyId } });
    if (!listing) {
      throw new Error("Property not found");
    }

    const reviews = await reviewRepo.find({
      where: { listing_id: propertyId },
      order: { submitted_at: "DESC" }
    });

    const approvedReviews = reviews.filter(r => r.approved);
    const totalReviews = reviews.length;
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

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(r => {
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

    // Monthly performance
    const monthlyStats = this.calculateMonthlyStats(reviews);

    // Category performance
    const categoryStats = this.calculateCategoryStats(reviews);

    // Trend indicators
    const trends = this.calculateTrends(reviews);

    return {
      property: {
        id: listing.id,
        name: listing.name
      },
      metrics: {
        totalReviews,
        approvedReviews: approvedReviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        approvalRate: totalReviews > 0 
          ? Math.round((approvedReviews.length / totalReviews) * 100)
          : 0
      },
      ratingDistribution,
      monthlyStats,
      categoryStats,
      trends
    };
  },

  // Get trend analysis for a property
  async getPropertyTrends(propertyId: string, period: string) {
    const reviewRepo = AppDataSource.getRepository(Review);
    
    const days = this.getPeriodDays(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const reviews = await reviewRepo.find({
      where: { 
        listing_id: propertyId,
        submitted_at: { $gte: startDate } as any
      },
      order: { submitted_at: "ASC" }
    });

    // Group by time periods
    const timeGroups = this.groupReviewsByTime(reviews, period);
    
    // Calculate trends
    const volumeTrend = timeGroups.map(group => ({
      period: group.period,
      count: group.reviews.length,
      averageRating: (() => {
        let totalRating = 0;
        let validRatings = 0;
        
        group.reviews.forEach((r: any) => {
          const rating = parseFloat(String(r.rating || '0'));
          if (!isNaN(rating) && rating >= 0 && rating <= 5) {
            totalRating += rating;
            validRatings++;
          }
        });
        
        return validRatings > 0 ? totalRating / validRatings : 0;
      })()
    }));

    const approvalTrend = timeGroups.map(group => ({
      period: group.period,
      approved: group.reviews.filter((r: any) => r.approved).length,
      total: group.reviews.length,
      approvalRate: group.reviews.length > 0 
        ? (group.reviews.filter((r: any) => r.approved).length / group.reviews.length) * 100
        : 0
    }));

    return {
      volumeTrend,
      approvalTrend,
      insights: this.generateInsights(reviews, timeGroups)
    };
  },

  // Helper methods
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

  calculateMonthlyStats(reviews: any[]) {
    const monthlyData = new Map();
    
    reviews.forEach(review => {
      const date = new Date(review.submitted_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { reviews: [], totalRating: 0, approved: 0 });
      }
      
      const monthData = monthlyData.get(monthKey);
      monthData.reviews.push(review);
      const rating = parseFloat(String(review.rating || '0'));
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        monthData.totalRating += rating;
      }
      if (review.approved) monthData.approved++;
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      reviewCount: data.reviews.length,
      averageRating: data.reviews.length > 0 
        ? Math.round((data.totalRating / data.reviews.length) * 10) / 10
        : 0,
      approvalRate: data.reviews.length > 0 
        ? Math.round((data.approved / data.reviews.length) * 100)
        : 0
    })).sort((a, b) => a.month.localeCompare(b.month));
  },

  calculateTrends(reviews: any[]) {
    if (reviews.length < 2) return { rating: 'stable', volume: 'stable', approval: 'stable' };

    const recent = reviews.slice(0, Math.ceil(reviews.length / 2));
    const older = reviews.slice(Math.ceil(reviews.length / 2));

    const recentAvgRating = recent.length > 0 ? recent.reduce((sum, r) => sum + (parseFloat(String(r.rating || '0')) || 0), 0) / recent.length : 0;
    const olderAvgRating = older.length > 0 ? older.reduce((sum, r) => sum + (parseFloat(String(r.rating || '0')) || 0), 0) / older.length : 0;
    
    const recentVolume = recent.length;
    const olderVolume = older.length;
    
    const recentApprovalRate = recent.filter(r => r.approved).length / recent.length;
    const olderApprovalRate = older.filter(r => r.approved).length / older.length;

    return {
      rating: recentAvgRating > olderAvgRating ? 'up' : recentAvgRating < olderAvgRating ? 'down' : 'stable',
      volume: recentVolume > olderVolume ? 'up' : recentVolume < olderVolume ? 'down' : 'stable',
      approval: recentApprovalRate > olderApprovalRate ? 'up' : recentApprovalRate < olderApprovalRate ? 'down' : 'stable'
    };
  },

  getPeriodDays(period: string): number {
    switch (period) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  },

  groupReviewsByTime(reviews: any[], period: string) {
    const groups = new Map();
    
    reviews.forEach(review => {
      const date = new Date(review.submitted_at);
      let groupKey: string;
      
      if (period === '7d') {
        groupKey = date.toISOString().split('T')[0] || date.toISOString().substring(0, 10); // Daily
      } else if (period === '30d') {
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // Daily
      } else {
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Monthly
      }
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { period: groupKey, reviews: [] });
      }
      groups.get(groupKey).reviews.push(review);
    });

    return Array.from(groups.values()).sort((a, b) => a.period.localeCompare(b.period));
  },

  generateInsights(reviews: any[], timeGroups: any[]) {
    const insights = [];
    
    if (reviews.length === 0) {
      insights.push("No reviews found for this period");
      return insights;
    }

    // Volume insights
    const totalReviews = reviews.length;
    const recentReviews = timeGroups[timeGroups.length - 1]?.reviews.length || 0;
    const previousReviews = timeGroups[timeGroups.length - 2]?.reviews.length || 0;
    
    if (recentReviews > previousReviews) {
      insights.push(`Review volume increased by ${recentReviews - previousReviews} reviews this period`);
    } else if (recentReviews < previousReviews) {
      insights.push(`Review volume decreased by ${previousReviews - recentReviews} reviews this period`);
    }

    // Rating insights - Safe average rating calculation
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
    if (averageRating >= 4.5) {
      insights.push("Excellent average rating maintained");
    } else if (averageRating < 3.5) {
      insights.push("Average rating needs attention");
    }

    // Approval insights
    const approvalRate = (reviews.filter(r => r.approved).length / reviews.length) * 100;
    if (approvalRate < 50) {
      insights.push("Consider approving more reviews to improve public visibility");
    }

    return insights;
  }
};
