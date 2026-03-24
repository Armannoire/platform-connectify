import { NextResponse } from "next/server";
import { register } from "@/server/services/auth.service";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { name, email, password, confirmedPassword } = body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !confirmedPassword?.trim()
    ) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const result = await register(
      name.trim(),
      email.trim(),
      password,
      confirmedPassword
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: result.data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register route error:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
