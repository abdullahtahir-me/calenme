import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  // FIX #1: Access id directly, no await
  const {id} = await params;
    // console.log(id);
    const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
    
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
      const { data, error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
    
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
        // console.log(error);
      }
    
      return NextResponse.json({ data }, { status: 201 });
    
}