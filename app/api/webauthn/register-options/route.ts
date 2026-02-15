import { generateRegistrationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req:Request){
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string };

  const user = await User.findById(decoded.id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const normalized = user.email.toLowerCase().trim();

  const options = await generateRegistrationOptions({
    rpName:"Billing SaaS",
    rpID:process.env.RP_ID!,
    userID: Buffer.from(user._id.toString(), "utf8"),
    userName: normalized,
    timeout:60000,

    excludeCredentials: user?.credentials?.map((c:any)=>({
      id: Buffer.from(c.credentialID.data ?? c.credentialID)
            .toString("base64url"),
      type:"public-key"
    })) || []
  });

  await User.updateOne(
    { _id: user._id },
    {
      $set:{
        currentChallenge:options.challenge,
        challengeExpires:new Date(Date.now()+300000)
      }
    }
  );

  return NextResponse.json(options);
}
