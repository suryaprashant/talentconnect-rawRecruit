import ReqInfo from '../models/ReqInfo.js';  // ✅ Changed from RawRecruit to ReqInfo

class ReqInfoService {
  // Create new request
  async createRequest(data) {
    try {
      const newRequest = new ReqInfo({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        serviceType:data.type,
        message: data.message,
        acceptTerms: data.acceptTerms,
        status: 'pending'
      });

      const savedRequest = await newRequest.save();
      return savedRequest;
    } catch (error) {
      throw error;
    }
  }

  
  async getAllRequests(query = {}) {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const skip = (page - 1) * limit;
      const status = query.status;

      
      const filter = {};
      if (status && ['pending', 'resolved', 'rejected'].includes(status)) {
        filter.status = status;
      }

      // Get total count for pagination
      const total = await ReqInfo.countDocuments(filter);

      // Get requests
      const requests = await ReqInfo.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v');

      return {
        data: requests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get single request by ID
  async getRequestById(id) {
    try {
      const request = await ReqInfo.findById(id).select('-__v');
      return request;
    } catch (error) {
      throw error;
    }
  }

  // Update request status
  async updateRequestStatus(id, status) {
    try {
      const validStatuses = ['pending', 'resolved', 'rejected'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }

      const request = await ReqInfo.findByIdAndUpdate(
        id,
        { 
          status, 
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      ).select('-__v');

      return request;
    } catch (error) {
      throw error;
    }
  }

  // Reject request (set status to rejected)
  async rejectRequest(id) {
    try {
      const request = await ReqInfo.findByIdAndUpdate(
        id,
        { 
          status: 'rejected',
          updatedAt: new Date() 
        },
        { new: true }
      ).select('-__v');

      return request;
    } catch (error) {
      throw error;
    }
  }

  
   async resolveRequest(id, adminMessage = '', meetingLink = '') {
    try {
      const updateData = {
        status: 'resolved',
        updatedAt: new Date(),
        resolvedAt: new Date(),
      };

      
      if (adminMessage) {
        updateData.adminMessage = adminMessage;
      }

     
      if (meetingLink) {
        updateData.meetingLink = meetingLink;
      }

      const request = await ReqInfo.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).select('-__v');

      return request;
    } catch (error) {
      throw error;
    }
  }

  // Permanent delete from DB
  async permanentDeleteRequest(id) {
    try {
      const request = await ReqInfo.findByIdAndDelete(id);
      return request;
    } catch (error) {
      throw error;
    }
  }

  
  async getStats() {
    try {
      const total = await ReqInfo.countDocuments();
      const pending = await ReqInfo.countDocuments({ status: 'pending' });
      const resolved = await ReqInfo.countDocuments({ status: 'resolved' });
      const rejected = await ReqInfo.countDocuments({ status: 'rejected' });

      return {
        total,
        pending,
        resolved,
        rejected
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ReqInfoService();