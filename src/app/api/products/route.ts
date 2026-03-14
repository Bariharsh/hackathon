import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product.model";
import { getUserFromToken } from "@/lib/auth";
import { getCache, setCache, deleteCacheByPattern } from "@/lib/cache";
import { NextRequest } from "next/server";

const PRODUCTS_LIST_KEY = "products:list";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    getUserFromToken(req);

    const body = await req.json();

    const product = await Product.create({
      name: body.name,
      sku: body.sku,
      categoryId: body.categoryId,
      unit: body.unit,
      reorderLevel: body.reorderLevel
    });

    // Clear products cache
    await deleteCacheByPattern("products:*");

    return NextResponse.json({
      message: "Product created",
      product
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function GET() {
  await connectDB();

  // Check Redis cache first
  const cached = await getCache(PRODUCTS_LIST_KEY);

  if (cached) {
    return NextResponse.json(cached);
  }

  // Fetch from DB
  const products = await Product.find().populate("categoryId");

  // Store in Redis
  await setCache(PRODUCTS_LIST_KEY, products, 60);

  return NextResponse.json(products);
}