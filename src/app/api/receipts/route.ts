import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createReceipt, listReceipts } from "@/services/receipt.service";
import {
  buildReceiptListCacheKey,
  getCache,
  setCache,
  invalidateReceiptCache,
} from "@/lib/cache";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  try {
    const cacheKey = buildReceiptListCacheKey();

    const cached = await getCache<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          data: cached,
          cached: true,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    await connectDB();

    const receipts = await listReceipts();

    await setCache(cacheKey, receipts, 60);

    return NextResponse.json(
      {
        success: true,
        data: receipts,
        cached: false,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
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
    const ip = getClientIp(req);

    const rateLimit = await checkRateLimit({
      key: `ratelimit:receipts:create:${ip}`,
      limit: 20,
      windowSeconds: 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many create requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    await connectDB();

    const body = await req.json();
    const receipt = await createReceipt(body);

    await invalidateReceiptCache(receipt._id.toString());

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