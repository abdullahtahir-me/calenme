import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authData = await request.json();
  const { email, password } = await authData;
  console.log(authData);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "localhost:3001",
    },
  });
  if (error) {
    console.log("supabase signup error" + error);
    return NextResponse.json(
      { error: "Could not signup user" + error.message },
      { status: 400 }
    );
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
  console.log(data);
}
