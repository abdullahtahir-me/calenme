import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// PATCH — update an assignment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { toggledState } = body;

  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .update({ is_done: toggledState })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Assignment updated successfully" });
}

// DELETE — delete an assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });

  }

  return NextResponse.json({ message: "Assignment deleted successfully" });
}
