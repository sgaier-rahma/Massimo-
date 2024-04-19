import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// GET SINGLE user
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const product = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// UPDATE SINGLE user
export const PUT = async (
  req: NextRequest,
  { params, body }: { params: { id: string }; body: { name: string } }
) => {
  const { id } = params;
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
      },
    });

    return new NextResponse(JSON.stringify("User has been updated!"), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
}


// DELETE SINGLE USER
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // Delete the user's orders
    await prisma.order.deleteMany({
      where: {
        userEmail: (await prisma.user.findUnique({ where: { id } }))?.email,
      },
    });

    // Delete the user's restaurants' categories' products
    const userRestaurants = await prisma.restaurant.findMany({
      where: {
        ownerID: id,
      },
      include: {
        catagories: {
          include: {
            products: true,
          },
        },
      },
    });

    for (const restaurant of userRestaurants) {
      for (const category of restaurant.catagories) {
        await prisma.product.deleteMany({
          where: {
            catSlug: category.slug,
          },
        });
      }

      // Delete the restaurant's categories
      await prisma.category.deleteMany({
        where: {
          restSlug: restaurant.slug,
        },
      });
    }

    // Delete the user's restaurants
    await prisma.restaurant.deleteMany({
      where: {
        ownerID: id,
      },
    });

    // Delete the user and all related data (accounts, sessions)
    await prisma.$transaction([
      prisma.user.delete({
        where: { id },
        include: {
          accounts: true,
          sessions: true,
        },
      }),
    ]);

    return new NextResponse(JSON.stringify("User and related data have been deleted!"), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};