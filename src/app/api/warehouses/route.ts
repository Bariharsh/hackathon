import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Warehouse from "@/models/warehouse.model";
import { getUserFromToken } from "@/lib/auth";
import { getCache, setCache, deleteCacheByPattern } from "@/lib/cache";
import { NextRequest } from "next/server";

const WAREHOUSE_LIST_KEY = "warehouses:list";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    getUserFromToken(req);

    const body = await req.json();

    const warehouse = await Warehouse.create({
      name: body.name,
      address: body.address
    });

    // clear cache
    await deleteCacheByPattern("warehouses:*");

    return NextResponse.json({
      message: "Warehouse created",
      warehouse
    });

  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function GET() {
  await connectDB();

  const cached = await getCache(WAREHOUSE_LIST_KEY);

  if (cached) {
    return NextResponse.json(cached);
  }

  const warehouses = await Warehouse.find().sort({ createdAt: -1 });

  await setCache(WAREHOUSE_LIST_KEY, warehouses, 60);

  return NextResponse.json(warehouses);
}