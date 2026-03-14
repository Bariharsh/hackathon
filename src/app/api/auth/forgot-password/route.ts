import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { generateOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mail";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const otp = generateOTP();

  await redis.set(`otp:${email}`, otp, "EX", 300);

  await sendOTPEmail(email, otp);

  return NextResponse.json({
    message: "OTP sent to your email",
  });
}