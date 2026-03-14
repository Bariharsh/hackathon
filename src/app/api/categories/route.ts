import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/category.model";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { getCache, setCache } from "@/lib/cache";

const cacheKey = "categories:list";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    getUserFromToken(req);

    const body = await req.json();

    const category = await Category.create({
      name: body.name,
      description: body.description
    });

    await setCache(cacheKey, null);

    return NextResponse.json({
      message: "Category created",
      category
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

  
  const cached = await getCache(cacheKey);

  if (cached) {
    return NextResponse.json(cached);
  }


  const categories = await Category.find().sort({ createdAt: -1 });

  await setCache(cacheKey, categories);

  return NextResponse.json(categories);
}