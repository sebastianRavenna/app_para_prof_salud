import mongoose from "mongoose";

const ClinicalHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    files: [{
      filename: String,
      path: String,
      url: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const ClinicalHistory = mongoose.model("ClinicalHistory", ClinicalHistorySchema);

export { ClinicalHistory };
