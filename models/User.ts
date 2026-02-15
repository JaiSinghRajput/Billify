import mongoose from "mongoose";

const CredentialSchema = new mongoose.Schema({
  credentialID: { type: Buffer, required: true },
  publicKey: { type: Buffer, required: true },
  counter: { type: Number, required: true },

  transports: [String],
  credentialDeviceType: String,
  credentialBackedUp: Boolean,
}, { _id: false });

const UserSchema = new mongoose.Schema(
{
  email: { type: String, unique: true, required: true },

  // optional if hybrid login
  password: String,

  // ===== BUSINESS =====
  businessName: String,
  ownerName: String,
  gstNo: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,

  logo: String,
  signature: String,

  bankName: String,
  accountNumber: String,
  ifscCode: String,
  upiId: String,

  // ===== WEBAUTHN =====
  currentChallenge: String,
  challengeExpires: Date,

  credentials: [CredentialSchema],
},
{ timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
