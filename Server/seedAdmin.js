const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("./models/User");
const Profile = require("./models/Profile");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const ADMIN_EMAIL = "admin@studyverse.in";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_FIRST_NAME = "StudyVerse";
const ADMIN_LAST_NAME = "Admin";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URL);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing && existing.accountType === "Admin") {
      console.log("Admin already exists. Skipping seed.");
      await mongoose.disconnect();
      return;
    }

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: "Platform administrator for StudyVerse.",
      contactNumber: null,
    });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        accountType: "Admin",
        approved: true,
        active: true,
        additionalDetails: profile._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${ADMIN_FIRST_NAME}${ADMIN_LAST_NAME}`,
      },
      { upsert: true, new: true }
    );

    console.log(
      `Admin seeded: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`
    );
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
