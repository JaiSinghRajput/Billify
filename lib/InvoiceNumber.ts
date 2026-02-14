import Counter from "@/models/Counter";

export async function generateInvoiceNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: "invoice" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const number = counter.seq.toString().padStart(3, "0");

  return `INV-${number}`;
}
