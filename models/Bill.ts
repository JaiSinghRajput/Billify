import mongoose from "mongoose";

const BillSchema = new mongoose.Schema(
  {
    // vendor = user reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invoiceNumber: String,

    clientName: String,
    clientPhone: String,

    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],

    subtotal: Number,
    gst: Number,
    total: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Bill ||
  mongoose.model("Bill", BillSchema);
