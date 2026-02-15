import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { normalizeBuffer } from "@/lib/webauthn";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, credential } = await req.json();
    const normalized = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalized });
    if (!user) return NextResponse.json({ verified: false }, { status: 401 });

    if (!user.challengeExpires || user.challengeExpires < new Date())
      return NextResponse.json({ verified: false }, { status: 400 });

    const dbCredential = user.credentials.find((c: any) =>
      normalizeBuffer(c.credentialID)
        .equals(Buffer.from(credential.rawId, "base64url"))
    );

    if (!dbCredential)
      return NextResponse.json({ verified: false }, { status: 401 });
    const cred = {
      id: normalizeBuffer(dbCredential.credentialID),
      publicKey: normalizeBuffer(dbCredential.publicKey),
      counter: dbCredential.counter,
    } as any;


    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.ORIGIN!,
      expectedRPID: process.env.RP_ID!,
      credential: cred


    });

    if (!verification.verified)
      return NextResponse.json({ verified: false }, { status: 401 });

    await User.updateOne(
      { email: normalized, "credentials.credentialID": dbCredential.credentialID },
      {
        $set: {
          "credentials.$.counter":
            verification.authenticationInfo.newCounter
        },
        $unset: { currentChallenge: "", challengeExpires: "" }
      }
    );

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ verified: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
