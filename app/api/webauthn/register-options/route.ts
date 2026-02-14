import { generateRegistrationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const options = await generateRegistrationOptions({
    rpName: "Billing SaaS",
    rpID: "localhost",
    userID: email,
    userName: email,
  });

  // Save challenge in DB
  await User.findOneAndUpdate(
    { email },
    { currentChallenge: options.challenge },
    { upsert: true }
  );

  return NextResponse.json(options);
}
