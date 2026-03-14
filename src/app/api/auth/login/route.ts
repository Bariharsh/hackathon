import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { comparePassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = generateToken(user._id.toString());

  return NextResponse.json({
    message: "Login successful",
    token,
  });
}