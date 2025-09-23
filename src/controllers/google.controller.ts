// src/controllers/google.controller.ts
import { Request, Response } from "express";
import { GoogleService } from "../services/google.service";

export const GoogleController = {
  seed: async (req: Request, res: Response) => {
    try {
      await GoogleService.seedMockGoogleReviews();
      res.json({ 
        ok: true, 
        message: "Google reviews seeded successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        ok: false, 
        error: "Failed to seed Google reviews" 
      });
    }
  },

  fetch: async (req: Request, res: Response) => {
    try {
      const { placeId } = req.params;
      if (!placeId) {
        return res.status(400).json({ 
          ok: false, 
          error: "Place ID is required" 
        });
      }
      const result = await GoogleService.fetchFromGooglePlaces(placeId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        ok: false, 
        error: "Failed to fetch Google reviews" 
      });
    }
  }
};
