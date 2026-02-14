import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: String,

    // ===== BUSINESS / VENDOR DETAILS =====
    businessName: String,
    ownerName: String,
    gstNo: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,

    // branding
    logo: String,
    signature: String,

    // optional billing info
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,

    // ===== AUTH =====
    currentChallenge: String,

    credentials: [
      {
        credentialID: String,
        publicKey: String,
        counter: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
