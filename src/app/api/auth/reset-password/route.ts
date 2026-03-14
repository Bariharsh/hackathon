import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  await connectDB();

  const { email, otp, newPassword } = await req.json();

  const storedOTP = await redis.get(`otp:${email}`);

  if (!storedOTP || storedOTP !== otp) {
    return NextResponse.json(
      { message: "Invalid OTP" },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(newPassword);

  await User.updateOne(
    { email },
    { password: hashed }
  );

  await redis.del(`otp:${email}`);

  return NextResponse.json({
    message: "Password reset successful"
  });
}