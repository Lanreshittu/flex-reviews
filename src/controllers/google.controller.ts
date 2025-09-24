import { Request, Response } from "express";
import { GoogleService } from "../services/google.service";

export const GoogleController = {
  // Get Google reviews
  getReviews: async (req: Request, res: Response) => {
    try {
      const { listing } = req.query;
      const reviews = await GoogleService.getGoogleReviews(listing as string);
      
      res.json({
        ok: true,
        reviews,
        total: reviews.length
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: "Failed to fetch Google reviews"
      });
    }
  },

  // Sync Google reviews for a listing
  syncReviews: async (req: Request, res: Response) => {
    try {
      const { listingId, placeId } = req.body;
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          ok: false,
          error: "Google Places API key not configured"
        });
      }

      if (!listingId || !placeId) {
        return res.status(400).json({
          ok: false,
          error: "listingId and placeId are required"
        });
      }

      const result = await GoogleService.syncGoogleReviews(listingId, placeId, apiKey);
      
      res.json({
        ok: result.success,
        message: result.message,
        reviews: result.reviews
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: "Failed to sync Google reviews"
      });
    }
  },

  // Test Google Places API connection
  testConnection: async (req: Request, res: Response) => {
    try {
      const { placeId } = req.query;
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          ok: false,
          error: "Google Places API key not configured"
        });
      }

      if (!placeId) {
        return res.status(400).json({
          ok: false,
          error: "placeId is required"
        });
      }

      const googleData = await GoogleService.fetchGoogleReviews(placeId as string, apiKey);
      res.json({
        ok: true,
        message: "Google Places API connection successful",
        data: {
          name: googleData.name,
          rating: googleData.rating,
          reviewCount: googleData.reviews?.length || 0
        }
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: `Google Places API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
};