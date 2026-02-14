import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email, credential } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ verified: false });

  const verification = await verifyRegistrationResponse({
    response: credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
  });

  if (verification.verified && verification.registrationInfo) {
    const { credential: cred } = verification.registrationInfo;

    await User.updateOne(
      { email },
      {
        $push: {
          credentials: {
            credentialID: cred.id,
            publicKey: Buffer.from(cred.publicKey).toString("base64"),
            counter: cred.counter,
          },
        },
        $unset: { currentChallenge: "" },
      }
    );
  }

  return NextResponse.json({ verified: verification.verified });
}
