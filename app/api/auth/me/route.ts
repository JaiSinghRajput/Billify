import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; email: string };

    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}
