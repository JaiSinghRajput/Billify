import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  // populate vendor details properly
  const bill = await Bill.findById(id).populate({
    path: "userId",
    select: "businessName address phone gstNo signature logo",
  });

  if (!bill) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json({
    bill,
    vendor: bill.userId,
  });
}