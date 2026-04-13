// controllers/ticker.controller.js

import { getTickerDataService } from "../services/liveTickerService.js";

export const getTickerData = async (req, res) => {
  try {
    const tickerItems = await getTickerDataService();

    return res.status(200).json({
      success: true,
      data: tickerItems, 
    });
  } catch (error) {
    console.error("Ticker API error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ticker data",
    });
  }
};