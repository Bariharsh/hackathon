import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Location from "@/models/location.model";
import { getUserFromToken } from "@/lib/auth";
import { getCache, setCache, deleteCacheByPattern } from "@/lib/cache";
import { NextRequest } from "next/server";

const LOCATION_LIST_KEY = "locations:list";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    getUserFromToken(req);

    const body = await req.json();

    const location = await Location.create({
      name: body.name,
      warehouseId: body.warehouseId
    });

    await deleteCacheByPattern("locations:*");

    return NextResponse.json({
      message: "Location created",
      location
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

  const cached = await getCache(LOCATION_LIST_KEY);

  if (cached) {
    return NextResponse.json(cached);
  }

  const locations = await Location.find()
    .populate("warehouseId")
    .sort({ createdAt: -1 });

  await setCache(LOCATION_LIST_KEY, locations, 60);

  return NextResponse.json(locations);
}