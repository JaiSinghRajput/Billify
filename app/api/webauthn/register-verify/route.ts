import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req:Request){
  await connectDB();

  try{
    const { credential } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ verified:false },{status:401});
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id);
    if(!user) return NextResponse.json({verified:false},{status:404});

    if(!user.challengeExpires || user.challengeExpires < new Date())
      return NextResponse.json({verified:false},{status:400});

    const verification = await verifyRegistrationResponse({
      response:credential,
      expectedChallenge:user.currentChallenge,
      expectedOrigin:process.env.ORIGIN!,
      expectedRPID:process.env.RP_ID!,
    });

    if(!verification.verified || !verification.registrationInfo)
      return NextResponse.json({verified:false},{status:400});

    const cred = verification.registrationInfo.credential;
    const credentialId =
      typeof cred.id === "string"
        ? Buffer.from(cred.id, "base64url")
        : Buffer.from(cred.id);

    await User.updateOne(
      { _id: user._id },
      {
        $push:{
          credentials:{
            credentialID: credentialId,
            publicKey: Buffer.from(cred.publicKey),
            counter: cred.counter
          }
        },
        $unset:{ currentChallenge:"", challengeExpires:"" }
      }
    );

    return NextResponse.json({ verified:true });

  }catch(err){
    console.error(err);
    return NextResponse.json({verified:false},{status:500});
  }
}
