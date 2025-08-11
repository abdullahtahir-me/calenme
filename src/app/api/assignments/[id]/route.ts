import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest, {params}:{
    params : {id :string}
}) {
    const id = (await params).id;
    console.log(id);
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
        return NextResponse.json({ error: error.message }, { status: 400 });
        console.log(error);
      }
    
      return NextResponse.json({ data }, { status: 200 });
    
}




export async function PATCH(
  request: NextRequest,
  {params}:{ params: {id: string} }
) {
  const id = (await params).id;
  const body = await request.json();
  const { toggledState } = body;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("assignments")
    .update({ is_submitted: toggledState })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
