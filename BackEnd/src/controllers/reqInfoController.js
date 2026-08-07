import reqInfoService from "../services/ReqInfoService.js";
import { newInfoReqQueue } from "../queue/newInfoReqQueue.js";
import ReqInfo from "../models/ReqInfo.js";
import { resolveInfoQueue } from "../queue/resolveInfoQueue.js";

class ReqInfoController {
  async createRequest(req, res) {
    try {
      const { name, email, date, time, message, acceptTerms, type } = req.body;

      // Validation
      if (!name || !email || !date || !time || !message || !acceptTerms) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Email validation
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }

      // Create request
      const newRequest = await reqInfoService.createRequest({
        name,
        email,
        date,
        time,
        message,
        type,
        acceptTerms,
      });

      newInfoReqQueue.add(
        "send-reqinfo-email",
        {
          email: email,
          name: name,
          message: message,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      );

      res.status(201).json({
        success: true,
        message: "Request submitted successfully",
        data: newRequest,
      });
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get all requests (Admin)
  async getAllRequests(req, res) {
    try {
      const { page, limit, status } = req.query;

      const result = await reqInfoService.getAllRequests({
        page,
        limit,
        status,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get single request by ID (Admin)
  async getRequestById(req, res) {
    try {
      const { id } = req.params;

      const request = await reqInfoService.getRequestById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Reject request (Admin)
  async rejectRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await reqInfoService.rejectRequest(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Request rejected successfully",
        data: request,
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async resolveRequest(req, res) {
    try {
      const { id } = req.params;
      const { adminMessage, meetingLink } = req.body;

      // First get the request to access user details
      const request = await reqInfoService.getRequestById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      // Resolve the request
      const updatedRequest = await reqInfoService.resolveRequest(
        id,
        adminMessage,
        meetingLink,
      );

      if (!updatedRequest) {
        return res.status(404).json({
          success: false,
          message: "Failed to resolve request",
        });
      }

      // Add to queue for sending email notification
      try {
        await resolveInfoQueue.add(
          "resolve-reqinfo-email",
          {
            email: request.email,
            name: request.name,

            adminMessage:
              adminMessage || "Your service request has been approved!",
            meetingLink: meetingLink || "",
          },
          {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 5000,
            },
            removeOnComplete: 100,
            removeOnFail: 50,
          },
        );
        console.log(`📧 Email notification queued for ${request.email}`);
      } catch (queueError) {
        console.error("Failed to add job to queue:", queueError);
      }

      res.status(200).json({
        success: true,
        message: "Request resolved successfully",
        data: updatedRequest,
      });
    } catch (error) {
      console.error("Error resolving request:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async deleteRequest(req, res) {
    try {
      const { id } = req.params;

      const request = await reqInfoService.permanentDeleteRequest(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Request deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get statistics (Admin)
  async getStats(req, res) {
    try {
      const stats = await reqInfoService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new ReqInfoController();
