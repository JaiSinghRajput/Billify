import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req: any) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const bills = await Bill.find({ userId: decoded.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json(bills);
}
