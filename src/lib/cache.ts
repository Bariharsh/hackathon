import { NextRequest, NextResponse } from "next/server";
import { connectDB }from "@/lib/db";
import { createReceipt, listReceipts } from "@/services/receipt.service";

export async function GET() {
  try {
    await connectDB();

    const receipts = await listReceipts();

    return NextResponse.json(
      {
        success: true,
        data: receipts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch receipts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const receipt = await createReceipt(body);

    return NextResponse.json(
      {
        success: true,
        message: "Receipt created successfully.",
        data: receipt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create receipt.",
      },
      { status: 400 }
    );
  }
}