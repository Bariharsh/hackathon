import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({
    message: "User created",
    user,
  });
}