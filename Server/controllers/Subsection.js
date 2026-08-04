const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const FOLDER_NAME = process.env.FOLDER_NAME;

// generate a signed upload payload for direct browser -> Cloudinary video upload
exports.getVideoUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `video_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const paramsToSign = {
      timestamp,
      folder: FOLDER_NAME,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.API_SECRET
    );

    return res.status(200).json({
      success: true,
      data: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        timestamp,
        folder: FOLDER_NAME,
        publicId,
        signature,
        resourceType: 'video',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create Subsection handler function
exports.createSubsection = async (req, res) => {
  try {
    const { sectionId, title, description, videoUrl, timeDuration } = req.body;

    if (!sectionId || !title || !description || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration || "",
      description: description,
      videoUrl: videoUrl,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection created successfully..",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in creation of subsection",
      error: error.message,
    });
  }
};

// Handler function for updatedSubsection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, title, description, videoUrl, timeDuration } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;
    if (videoUrl) {
      subSection.videoUrl = videoUrl;
      if (timeDuration !== undefined) subSection.timeDuration = timeDuration;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection").exec();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update subsection",
      error: error.message,
    });
  }
};

// Handler function for deleteSubsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    await SubSection.findByIdAndDelete(subSectionId);

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete subsection",
      error: error.message,
    });
  }
};
