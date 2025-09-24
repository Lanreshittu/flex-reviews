import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

export const AnalyticsController = {
  // Get cross-property analytics overview
  getOverview: async (req: Request, res: Response) => {
    try {
      const overview = await AnalyticsService.getOverview();
      res.json({ ok: true, overview });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch analytics overview" });
    }
  },

  // Get performance comparison between properties
  getComparison: async (req: Request, res: Response) => {
    try {
      const { propertyIds } = req.query;
      const ids = Array.isArray(propertyIds) ? propertyIds : [propertyIds];
      const comparison = await AnalyticsService.getPropertyComparison(ids as string[]);
      res.json({ ok: true, comparison });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch property comparison" });
    }
  },

  // Get insights and recommendations
  getInsights: async (req: Request, res: Response) => {
    try {
      const insights = await AnalyticsService.getInsights();
      res.json({ ok: true, insights });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch insights" });
    }
  }
};
