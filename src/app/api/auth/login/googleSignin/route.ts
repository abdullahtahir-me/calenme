import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This function MUST be a GET handler to avoid the 405 Method Not Allowed error.
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const supabase = await createClient();

  // Get the special URL from Supabase
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // This MUST be the absolute URL to your callback handler from the prompt
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Supabase OAuth error:", error);
    // Redirect to an error page in case of a failure
    return NextResponse.redirect(`${origin}/login?error=oauth_error`);
  }

  if (data.url) {
    // Redirect the user's browser to the Google login page
    return NextResponse.redirect(data.url);
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/login?error=unknown_error`);
}