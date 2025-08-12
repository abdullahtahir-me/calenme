"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

type ScheduledClass = {
  sessionId: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'lecture' | 'lab';
  status: 'passed' | 'ongoing' | 'upcoming';
  courseId: string;
  courseName: string;
  courseCode: string;
  courseColor: string;
  instructor: string;
};

export default function ScheduleWidget() {
  const [upcomingClasses, setUpcomingClasses] = useState<ScheduledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    const response = await fetch("/api/dashboard/schedule");
    if (!response.ok) {
      setLoading(false);
      setError(true);
      console.log("Error occured in the assignment widget");
    }
    const data = await response.json();
    setUpcomingClasses(data===null? [] : data);
    setLoading(false);
    setError(false);
    console.log(data);
  };

  return loading ? (
    <div className="grid place-items-center"><MoonLoader size={30} speedMultiplier={0.6} /></div>
  ) : (
    // Inside your TodaysClassesWidget component...

    // Assume 'todaysCourses' is the array you fetched from the API.

    <div className="space-y-4">
      {upcomingClasses.length===0 ? <p>Hurrah! No Classes today</p>  :
      upcomingClasses.map((course) => (
        <div
          key={course.sessionId}
          className="relative p-3 border border-border rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full ${course.courseColor} mt-2 flex-shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{course.courseName}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {course.courseCode}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{course.instructor}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pl-6 space-y-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Clock className="h-3 w-3" />
                    <span>
                      {course.startTime} - {course.endTime}
                    </span>
                    <span className="text-muted-foreground">
                      ({course.type})
                    </span>
                  </div>
                  <Badge
                    variant={
                      course.status === "ongoing"
                        ? "default"
                        : course.status === "passed"
                        ? "outline"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="text-muted-foreground">{course.venue}</span>
                </div>
              </div>
        
          </div>
        </div>
      ))}
    </div>
  );
}



// Fuctions for later use
// const formatTimeUntil = (time: string) => {
//     // This would calculate actual time until class in a real app
//     const current = new Date();
//     const hour = parseInt(time.split(":")[0]);
//     const isAM = time.includes("AM");
//     const targetHour = isAM
//       ? hour === 12
//         ? 0
//         : hour
//       : hour === 12
//         ? 12
//         : hour + 12;

//     if (targetHour > current.getHours()) {
//       const hoursUntil = targetHour - current.getHours();
//       return hoursUntil === 1 ? "in 1 hour" : `in ${hoursUntil} hours`;
//     }
//     return "now";
//   };

//   // Get current time and day for realistic upcoming classes
//   const getCurrentDay = () => {
//     const days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     return days[new Date().getDay()];
//   };