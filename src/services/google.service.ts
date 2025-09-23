// src/services/google.service.ts
import { AppDataSource } from "../data-source";
import { Listing } from "../entity/Listing";
import { Review } from "../entity/Review";
import { normalizeGoogleReview } from "../lib/normalize";

export const GoogleService = {
  /**
   * Mock Google Reviews integration
   * In a real implementation, this would use the Google Places API
   */
  async seedMockGoogleReviews() {
    const mockGoogleReviews = [
      {
        id: "google:1",
        author_name: "Alex Thompson",
        rating: 5,
        text: "Amazing apartment with incredible views! The location is perfect and the host was very accommodating. Highly recommend!",
        time: new Date("2021-06-15").getTime() / 1000,
        listingName: "2B N1 A - 29 Shoreditch Heights"
      },
      {
        id: "google:2", 
        author_name: "Sophie Williams",
        rating: 4,
        text: "Great stay overall. The apartment was clean and well-equipped. The location is excellent for exploring London. Only minor issue was the WiFi speed.",
        time: new Date("2021-07-22").getTime() / 1000,
        listingName: "2B N1 A - 29 Shoreditch Heights"
      },
      {
        id: "google:3",
        author_name: "Mark Johnson", 
        rating: 5,
        text: "Outstanding experience! The apartment exceeded all expectations. Perfect for business trips with excellent amenities and responsive host.",
        time: new Date("2021-08-10").getTime() / 1000,
        listingName: "2B N1 A - 29 Shoreditch Heights"
      },
      {
        id: "google:4",
        author_name: "Emma Davis",
        rating: 3,
        text: "The apartment is nice but there were some maintenance issues during our stay. The host was responsive but it took time to resolve.",
        time: new Date("2021-09-05").getTime() / 1000,
        listingName: "2B N1 A - 29 Shoreditch Heights"
      },
      {
        id: "google:5",
        author_name: "James Wilson",
        rating: 5,
        text: "Perfect location and beautiful apartment! The host provided excellent local recommendations and the check-in process was seamless.",
        time: new Date("2021-10-12").getTime() / 1000,
        listingName: "2B N1 A - 29 Shoreditch Heights"
      }
    ];

    const listingRepo = AppDataSource.getRepository(Listing);
    const reviewRepo = AppDataSource.getRepository(Review);

    for (const reviewData of mockGoogleReviews) {
      // Find or create listing
      let listing = await listingRepo.findOne({ 
        where: { name: reviewData.listingName } 
      });
      
      if (!listing) {
        listing = listingRepo.create({ 
          name: reviewData.listingName, 
          external_ref: reviewData.listingName 
        });
        listing = await listingRepo.save(listing);
      }

      // Normalize and save review
      const normalized = normalizeGoogleReview(reviewData);
      const existing = await reviewRepo.findOne({ 
        where: { id: reviewData.id } 
      });

      if (existing) {
        Object.assign(existing, {
          listing_id: listing.id,
          ...normalized,
        });
        await reviewRepo.save(existing);
      } else {
        const toCreate = reviewRepo.create({
          id: reviewData.id,
          listing_id: listing.id,
          ...normalized,
        } as any);
        await reviewRepo.save(toCreate);
      }
    }
  },

  /**
   * Real Google Places API integration would go here
   * This is a placeholder for the actual implementation
   */
  async fetchFromGooglePlaces(placeId: string) {
    // In a real implementation, this would:
    // 1. Use Google Places API to fetch reviews
    // 2. Handle API rate limits and errors
    // 3. Parse and normalize the response
    // 4. Store in database
    
    console.log(`Would fetch Google reviews for place ID: ${placeId}`);
    console.log("Google Places API integration not implemented in this demo");
    
    return {
      success: false,
      message: "Google Places API integration not implemented"
    };
  }
};
