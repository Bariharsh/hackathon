import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/models/stock.model";
import { getCache, setCache } from "@/lib/cache";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  await connectDB();

  const cacheKey = `stock:product:${params.productId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return NextResponse.json(cached);
  }

  const stock = await Stock.find({
    productId: params.productId
  }).populate({
    path: "locationId",
    populate: { path: "warehouseId" }
  });

  await setCache(cacheKey, stock, 60);

  return NextResponse.json(stock);
}