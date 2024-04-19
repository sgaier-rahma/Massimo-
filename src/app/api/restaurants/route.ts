import { prisma } from "@/utils/connect";
import { NextResponse, NextRequest } from "next/server";


// FETCH ALL RESTAURANTS
export const GET = async () => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    return new NextResponse(JSON.stringify(restaurants), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// POST A NEW RESTAURANT
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const restaurant = await prisma.restaurant.create({
      data: body,
    });
    return new NextResponse(JSON.stringify(restaurant), { status: 201 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

