import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email, credential } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ verified: false });

  const dbCredential = user.credentials[0];

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    credential: {
      id: dbCredential.credentialID,
      publicKey: Buffer.from(dbCredential.publicKey, "base64"),
      counter: dbCredential.counter,
    },
  });

  if (verification.verified) {
    await User.updateOne(
      { email, "credentials.credentialID": dbCredential.credentialID },
      {
        $set: {
          "credentials.$.counter":
            verification.authenticationInfo.newCounter,
        },
        $unset: { currentChallenge: "" },
      }
    );
  }

  return NextResponse.json({ verified: verification.verified });
}
