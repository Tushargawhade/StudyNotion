const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Enrolled"],
      default: "Enrolled",
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Purchase", purchaseSchema);
