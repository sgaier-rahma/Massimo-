
import { prisma } from "@/utils/connect";
import { NextResponse, NextRequest } from "next/server";


// FETCH ALL CATEGORIES
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  console.log(cat);
  try {

    const categories = await prisma.category.findMany({
      where: {
        restSlug: cat
      },
    });
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// CREATE A NEW CATEGORY
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const Category = await prisma.category.create({
      data: body,
    });
    return new NextResponse(JSON.stringify(Category), { status: 201 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

