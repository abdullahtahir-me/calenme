import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest) {
    const supabase = await createClient();
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if (authError || !user){
        return NextResponse.json({meassage: "Unauthorized"}, {status:401});
    }

    const { data: assignmentData , error } = await supabase.rpc("get_assignments_with_courses");
    if(error){
        console.log(error);
        return NextResponse.json(error, {status: 400});
    }
    return NextResponse.json(assignmentData, {status: 201});

}



export async function POST(request:NextRequest) {
    const assignmentData = await request.json();
    const { title, description, type, course_id, dueDate } = assignmentData;
    console.log({ title, description, type, course_id, dueDate });
    const supabase = await createClient();
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if (authError || !user){
        return NextResponse.json({meassage: "Unauthorized"}, {status:401});
    }

    const { data, error: insertError } = await supabase.from('assignments').insert({
        title: title.trim(),
        user_id: user.id,
        course_id: course_id,
        description: description,
        type: type,
        due_date: dueDate,
    }).select().single();

    if(insertError){
        console.log(insertError);
        return NextResponse.json(insertError, {status: 400});
    }
    return NextResponse.json(data, {status: 201});
}