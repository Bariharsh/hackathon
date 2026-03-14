import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const userId = getUserFromToken(req);

    const user = await User.findById(userId).select("-password");

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const userId = getUserFromToken(req);

    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      body,
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated",
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}