import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
        console.log(authError);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: upcommingClasses, error } = await supabase.rpc("get_upcoming_assignments");
    if(error){
        return NextResponse.json(error, {status: 400});
    }
    console.log(upcommingClasses);
    return NextResponse.json(upcommingClasses, {status: 200});

}
