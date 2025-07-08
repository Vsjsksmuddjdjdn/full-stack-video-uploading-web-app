import { connectToDatabase } from "@/lib/db";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("➡️ API HIT");

  try {
    const { email, password } = await request.json();
    console.log("📨 Received:", email, password);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log("✅ MongoDB connected");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    await User.create({ email, password });
    console.log("✅ User created");

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 } // server error
    );
  }
}
