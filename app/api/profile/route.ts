import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({}, { status: 401 });

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string };

  const user = await User.findById(decoded.id).select("-password");

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({}, { status: 401 });

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string };

  const data = await req.json();

  const user = await User.findByIdAndUpdate(
    decoded.id,
    data,
    { new: true }
  );

  return NextResponse.json(user);
}
