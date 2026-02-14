import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" });

  const options = await generateAuthenticationOptions({
    rpID: "localhost",
  });

  await User.updateOne(
    { email },
    { currentChallenge: options.challenge }
  );

  return NextResponse.json(options);
}
