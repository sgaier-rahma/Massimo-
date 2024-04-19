import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const Restaurant = await prisma.restaurant.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(Restaurant), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  //todo:fix this
  // const session = await getAuthSession();

  // if (session?.user.isAdmin) {
  try {

    const Restaurants = await prisma.restaurant.findMany({
      where: {
        id: id,
      },
      include: {
        catagories: {
          include: {
            products: true,
          },
        },
      },
    });

    for (const restaurant of Restaurants) {
      for (const category of restaurant.catagories) {
        await prisma.product.deleteMany({
          where: {
            catSlug: category.slug,
          },
        });
      }


      await prisma.category.deleteMany({
        where: {
          restSlug: restaurant.slug,
        },
      });
    }


    await prisma.restaurant.deleteMany({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify("Restaurant has been deleted!"), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
  // }
  // return new NextResponse(JSON.stringify({ message: "You are not allowed!" }), {
  //   status: 403,
  // });
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string }; }
) => {
  const { id } = params;
  const body = await req.json();
  try {
    const Restaurant = await prisma.restaurant.update({
      where: {
        id: id,
      },
      data: body,
    });

    return new NextResponse(JSON.stringify(Restaurant), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
}