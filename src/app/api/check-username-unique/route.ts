import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = request.nextUrl;
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query Parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          messages: "username is already taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
