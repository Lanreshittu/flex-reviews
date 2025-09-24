import { Request, Response } from "express";
import { PropertyService } from "../services/property.service";

export const PropertyController = {
  // Get all properties with summary stats
  list: async (req: Request, res: Response) => {
    try {
      const properties = await PropertyService.getAllProperties();
      res.json({ ok: true, properties });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch properties" });
    }
  },

  // Get detailed performance metrics for a property
  getPerformance: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ ok: false, error: "Property id is required" });
      }
      const performance = await PropertyService.getPropertyPerformance(id);
      res.json({ ok: true, performance });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch property performance" });
    }
  },

  // Get trend analysis for a property
  getTrends: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ ok: false, error: "Property id is required" });
      }
      const { period = '30d' } = req.query;
      const periodStr = typeof period === 'string' ? period : '30d';
      const trends = await PropertyService.getPropertyTrends(id, periodStr);
      res.json({ ok: true, trends });
    } catch (error) {
      res.status(500).json({ ok: false, error: "Failed to fetch property trends" });
    }
  }
};
