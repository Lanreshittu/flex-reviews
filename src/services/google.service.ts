import { AppDataSource } from "../data-source";
import { Review } from "../entity/Review";
import { Listing } from "../entity/Listing";
import { normalizeGoogleReview } from "../lib/normalize";

export const GoogleService = {
  // Fetch reviews from Google Places API
  async fetchGoogleReviews(placeId: string, apiKey: string) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Google Places API Response:', JSON.stringify(data, null, 2));
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      throw error;
    }
  },

  // Save Google reviews to database
  async saveGoogleReviews(googleData: any, listingId: string) {
    const reviewRepo = AppDataSource.getRepository(Review);
    const listingRepo = AppDataSource.getRepository(Listing);
    
    const listing = await listingRepo.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }

    const savedReviews = [];
    
    if (googleData.reviews && googleData.reviews.length > 0) {
      for (const googleReview of googleData.reviews) {
        // Normalize the Google review using the standard normalize function
        const normalizedReview = normalizeGoogleReview(googleReview);
        
        // Check if review already exists
        const existingReview = await reviewRepo.findOne({
          where: {
            author_name: normalizedReview.author_name,
            submitted_at: normalizedReview.submitted_at,
            channel: 'google'
          }
        });

        if (!existingReview) {
          // Generate unique ID for Google review
          const reviewId = `google:${googleReview.author_name?.replace(/\s+/g, '_') || 'anonymous'}_${googleReview.time}`;
          
          const review = reviewRepo.create({
            id: reviewId,
            listing_id: listingId,
            author_name: normalizedReview.author_name,
            rating: normalizedReview.rating,
            comment: normalizedReview.comment,
            channel: normalizedReview.channel,
            submitted_at: normalizedReview.submitted_at,
            approved: false, // Default to pending approval
            categories: normalizedReview.categories,
            type: normalizedReview.type,
            status: normalizedReview.status,
            rating_raw: normalizedReview.rating_raw,
            title: normalizedReview.title,
            source_meta: normalizedReview.source_meta
          });

          const savedReview = await reviewRepo.save(review);
          savedReviews.push(savedReview);
        }
      }
    }

    return savedReviews;
  },

  // Get all Google reviews for a listing
  async getGoogleReviews(listingId?: string) {
    const reviewRepo = AppDataSource.getRepository(Review);
    
    const whereClause: any = { channel: 'google' };
    if (listingId) {
      whereClause.listing_id = listingId;
    }

    return await reviewRepo.find({
      where: whereClause,
      order: { submitted_at: 'DESC' }
    });
  },

  // Sync Google reviews for a specific listing
  async syncGoogleReviews(listingId: string, placeId: string, apiKey: string) {
    try {
      console.log(`Syncing Google reviews for listing ${listingId} with place ID ${placeId}`);
      
      const googleData = await this.fetchGoogleReviews(placeId, apiKey);
      const savedReviews = await this.saveGoogleReviews(googleData, listingId);
      
      console.log(`Successfully synced ${savedReviews.length} Google reviews`);
      return {
        success: true,
        message: `Synced ${savedReviews.length} new Google reviews`,
        reviews: savedReviews
      };
    } catch (error) {
      console.error('Error syncing Google reviews:', error);
      return {
        success: false,
        message: `Failed to sync Google reviews: ${error instanceof Error ? error.message : 'Unknown error'}`,
        reviews: []
      };
    }
  }
};