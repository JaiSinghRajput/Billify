import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  const normalized = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalized });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email: normalized,
    password: hashed
  });

  return NextResponse.json({ success: true });
}
