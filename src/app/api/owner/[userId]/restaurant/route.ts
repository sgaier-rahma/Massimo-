import { Restaurant } from '.prisma/client';
import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params;

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        ownerID: userId,
      },
    });

    return new NextResponse(JSON.stringify(restaurants), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

