import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const authData = await request.json();
    const { email, password } = await authData;
    console.log(authData)

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    
    if(error){
        // console.log("supabase login error" + error)
        return NextResponse.json({error: "Invalid credentials " + error.message}, {status: 401})
    }
    // console.log(data)

    return NextResponse.json({message: "Login Successful", session: data.session}, {status: 200})
}