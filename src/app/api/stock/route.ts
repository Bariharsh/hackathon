import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stock from "@/models/stock.model";
import { getCache, setCache } from "@/lib/cache";

const STOCK_LIST_KEY = "stock:list";

export async function GET() {
  await connectDB();

  const cached = await getCache(STOCK_LIST_KEY);

  if (cached) {
    return NextResponse.json(cached);
  }

  const stock = await Stock.find()
    .populate("productId")
    .populate({
      path: "locationId",
      populate: { path: "warehouseId" }
    });

  await setCache(STOCK_LIST_KEY, stock, 60);

  return NextResponse.json(stock);
}