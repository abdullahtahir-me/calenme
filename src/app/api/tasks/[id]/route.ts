import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(
  request: NextRequest,
  context: any
) {
  const id = context.params.id;
  const body = await request.json();
  const { toggledState } = body;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ is_done: toggledState })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
