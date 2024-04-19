import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL users
export const GET = async () => {
  try {
    const users = await prisma.user.findMany();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
