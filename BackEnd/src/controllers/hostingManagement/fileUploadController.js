// @desc    Upload file and send to confirmed users
// @route   POST /hosting-management/:eventType/:eventId/upload-and-send
export const uploadAndSendFile = async (req, res) => {
  try {
    const { eventType, eventId } = req.params;
    const { message } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get file details from Cloudinary
    const fileUrl = req.file.path; // Cloudinary URL
    const fileName = req.file.originalname;

    // Return the file details
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileUrl,
        fileName,
        message: message || ''
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
