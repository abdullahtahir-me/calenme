// File: src/app/api/tasks/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();

  if (authError || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tasks, error: selectError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  if (selectError) {
    console.error("Supabase select error:", selectError);
    return NextResponse.json(
      { error: "Failed to retrieve tasks." },
      { status: 500 }
    );
  }
  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(request: NextRequest) {
  // --- FIX #1: Correctly parse the JSON body ---
  const requestData = await request.json();
  const { title, description, priority, dueDate } = requestData; // No 'await' here
  console.log(requestData);
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();

  // --- FIX #2: API Routes must return a JSON error, not redirect ---
  if (authError || !data?.user) {
    // Do not use redirect() in API routes.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- FIX #3 (Database Type): Ensure this matches your DB schema ---
  // This logic is for a `priority` column of type `integer`.

  // --- FIX #4: You MUST 'await' the database query ---
  const { data: newTask, error: insertError } = await supabase
    .from("tasks")
    .insert({
      user_id: data.user.id,
      title: title,
      description: description,
      priority: priority,
      due_date: dueDate,
    })
    .select() // Use .select() to get the new row back
    .single(); // Use .single() because we inserted one row

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 }
    );
  }

  console.log("Newly created task:", newTask);
  return NextResponse.json(newTask, { status: 201 });
}


