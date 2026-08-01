const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

const FOLDER_NAME = process.env.FOLDER_NAME;

// create Subsection handler function
exports.createSubsection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;

    const video = req.files.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
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
    const { subSectionId, sectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    if (req.files && req.files.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
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
