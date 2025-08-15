import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const supabase = await createClient();
    const { data: {user}, error: authError } = await supabase.auth.getUser();
    if (authError || !user){
        return NextResponse.json({meassage: "Unauthorized"}, {status:401});
    }
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query")
    console.log("query: "+query);
    if(query=="avatar"){
        const { data: avatar_index , error } = await supabase.from('profiles').select('avatar_index').eq('id',user.id).single();
        
    if(error){
        console.log("error: "+ error.message);
        return NextResponse.json(error, {status: 400});
    }
    console.log("Ava index: "+avatar_index)
    return NextResponse.json(avatar_index, {status: 200});
    }

    const { data: profileData , error } = await supabase.from('profiles').select('*').eq('id',user.id).single();
    if(error){
        console.log(error);
        return NextResponse.json(error, {status: 400});
    }
    return NextResponse.json(profileData, {status: 200});
}