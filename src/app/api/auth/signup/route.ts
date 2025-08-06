import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const authData = await request.json();
    const { email, password } = await authData;
    console.log(authData)
    
    const supabase = await createClient();
    const { data, error} = await supabase.auth.signUp({
        email,
        password,
    })

    if(error){
        console.log("supabase signup error" + error)
        return NextResponse.json({error: "Could not signup user" + error.message}, {status:400})
    }
    console.log(data)
    return NextResponse.json({message: "Signup Successful", user: data.user})

}