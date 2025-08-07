import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
type ClassSession = {
  day: string;
  startTime: string;
  endTime: string;
  type: "lecture" | "lab";
  venue: string;
};

export async function POST(request: NextRequest) {
  const {
    courseName,
    courseCode,
    instructor,
    credits,
    description,
    color,
    sessions,
  } = await request.json();
  console.log(courseName,
    courseCode,
    instructor,
    credits,
    description,
    color,
    sessions,);
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  if (
    !courseName ||
    typeof courseName != "string" ||
    courseName.trim().length <= 0
  ) {
    console.log("course naem cannot be empty")
    return NextResponse.json(
      { message: "course name can't be empty" },
      { status: 400 }
    );
  }

  const scheduleItemsForDB = (sessions || []).map((session: ClassSession) => ({
    day_of_week: session.day,
    start_time: session.startTime,
    end_time: session.endTime,
    location: session.venue,
    is_lab: session.type === "lab",
  }));

  const { data: courseData, error: rpcError } = await supabase.rpc(
    "create_course_with_schedule",
    {
      course_name: courseName.trim(),
      course_code: courseCode.trim(),
      instructor: instructor,
      credits: credits,
      color: color,
      description: description,
      schedule_items: scheduleItemsForDB,
    }
  );

  if (rpcError) {
    console.error("Supabase RPC Error:", rpcError); // Log the actual error

    return NextResponse.json(
      { message: "Course can't be added" },
      { status: 400 }
    );
  }
  return NextResponse.json(courseData, { status: 201 });
}
