import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// --- DELETE HANDLER ---
export async function DELETE(
  request: NextRequest,
  // --- FIX: This is the correct Next.js signature for the second argument ---
  { params }: { params: { id: string } }
) {
  // --- FIX: 'params' is a direct object, not a promise. No 'await' needed. ---
  const id = params.id;
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase delete error:", error);
    // Improvement: Use 404 if the item wasn't found
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: "Assignment not found or permission denied." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete assignment." }, { status: 500 });
  }

  // Improvement: Return the data directly with a 200 OK status
  return NextResponse.json(data, { status: 200 });
}


// --- PATCH HANDLER ---
export async function PATCH(
  request: NextRequest,
  // --- FIX: This is the correct Next.js signature for the second argument ---
  { params }: { params: { id: string } }
) {
  // --- FIX: 'params' is a direct object, not a promise. No 'await' needed. ---
  const id = params.id;
  const body = await request.json();
  // It's safer to be specific about what you expect from the body
  const { is_submitted } = body;

  // Add validation for the incoming data
  if (typeof is_submitted !== 'boolean') {
      return NextResponse.json({ error: "Invalid 'is_submitted' value. Must be a boolean." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("assignments")
    .update({ is_submitted: is_submitted }) // Use the specific destructured variable
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Assignment not found or permission denied." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update assignment." }, { status: 500 });
  }

  // Improvement: A successful update returns 200 OK. Return the data directly.
  return NextResponse.json(data, { status: 200 });
}