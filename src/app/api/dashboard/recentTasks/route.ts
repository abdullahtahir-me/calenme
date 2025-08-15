import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
        // console.log(authError);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: recentTasks, error } = await supabase.from('tasks').select('id, title, priority, due_date').eq('user_id',user.id).order('created_at',{ascending:false}).limit(5);
    if(error){
        return NextResponse.json(error, {status: 400});
    }
    // console.log(recentTasks);
    return NextResponse.json(recentTasks, {status: 200});

}
