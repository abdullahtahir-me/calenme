import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()

    if(error){
        console.log("supabase logout error: " + error)
        return NextResponse.json({ error: 'Could not log out user.' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Logout successful!' });


}