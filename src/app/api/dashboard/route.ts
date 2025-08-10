import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.log(authError);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [coursesRes, tasksRes, assignmentsRes] = await Promise.all([
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const stats = {
    courses: coursesRes.count ?? 0,
    tasks: tasksRes.count ?? 0,
    assignments: assignmentsRes.count ?? 0,
  };
  console.log(stats);
  return NextResponse.json(stats);
}
