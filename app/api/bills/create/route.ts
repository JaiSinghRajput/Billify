
import { generateInvoiceNumber } from "@/lib/InvoiceNumber";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  // get logged in user
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string };

  const invoiceNumber = await generateInvoiceNumber();

  const bill = await Bill.create({
    userId: decoded.id,
    invoiceNumber,
    ...body,
  });

  return NextResponse.json({
    billId: bill._id,
  });
}
