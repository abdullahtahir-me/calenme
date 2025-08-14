import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// --- PATCH — update an assignment ---
export async function PATCH(
  request: NextRequest,
  // FIX #1: Correct the function signature
  { params }: { params: { id: string } }
) {
  // FIX #1: Access id directly, no await
  const id = params.id;
  const body = await request.json();
  const { is_submitted } = body; // Match the column name for clarity

  // Validation
  if (typeof is_submitted !== 'boolean') {
      return NextResponse.json({ error: "Invalid 'is_submitted' value. Must be a boolean." }, { status: 400 });
  }

  const supabase = await createClient();

  // FIX #2: Add authentication check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("assignments")
    .update({ is_submitted: is_submitted })
    // FIX #3: Add the critical security check for user_id
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

  return NextResponse.json(data, { status: 200 });
}


// --- DELETE — delete an assignment ---
// export async function DELETE(
//   request: NextRequest,
//   // FIX #1: Correct the function signature
//   { params }: { params: { id: string } }
// ) {
//   // FIX #1: Access id directly, no await
//   const id = params.id;
//   const supabase = await createClient();

//   // FIX #2: Add authentication check
//   const { data: { user }, error: authError } = await supabase.auth.getUser();
//   if (authError || !user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { data, error } = await supabase
//     .from("assignments")
//     .delete()
//     // FIX #3: Add the critical security check for user_id
//     .eq("id", id)
//     .eq("user_id", user.id)
//     .select()
//     .single();

//   if (error) {
//     console.error("Supabase delete error:", error);
//     if (error.code === 'PGRST116') {
//       return NextResponse.json({ error: "Assignment not found or permission denied." }, { status: 404 });
//     }
//     return NextResponse.json({ error: "Failed to delete assignment." }, { status: 500 });
//   }

//   return NextResponse.json(data, { status: 200 });
// }