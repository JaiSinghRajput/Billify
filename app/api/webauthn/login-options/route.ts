import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { normalizeBuffer } from "@/lib/webauthn";

export async function POST(req:Request){
  await connectDB();

  try{
    const { email } = await req.json();
    const normalized = email.toLowerCase().trim();

    const user = await User.findOne({ email:normalized });
    if(!user)
      return NextResponse.json({error:"User not found"},{status:404});

    if(!user.credentials?.length) {
      return NextResponse.json({ hasPasskeys: false });
    }

    const options = await generateAuthenticationOptions({
      rpID:String(process.env.RP_ID),
      timeout:60000,
      userVerification:"preferred",

      allowCredentials: user.credentials.map((c:any)=>({
        id: normalizeBuffer(c.credentialID).toString("base64url"),
        type:"public-key"
      }))
    });

    await User.updateOne(
      { email:normalized },
      {
        $set:{
          currentChallenge:options.challenge,
          challengeExpires:new Date(Date.now()+300000)
        }
      }
    );

    return NextResponse.json({ ...options, hasPasskeys: true });

  }catch(err){
    console.error(err);
    return NextResponse.json({error:"Failed"},{status:500});
  }
}
