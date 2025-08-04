import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Award } from "lucide-react";

export function Courses() {
  const courses = [
    {
      id: 1,
      name: "Calculus I",
      code: "MATH 101",
      instructor: "Dr. Sarah Johnson",
      credits: 4,
      schedule: "MWF 9:00-10:00 AM",
      room: "Math Building 205",
      grade: "A-",
      assignments: 8,
      nextClass: "2024-10-15T09:00:00",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Introduction to Biology",
      code: "BIO 101",
      instructor: "Prof. Michael Chen",
      credits: 3,
      schedule: "TTh 11:00-12:30 PM",
      room: "Science Hall 110",
      grade: "A",
      assignments: 6,
      nextClass: "2024-10-15T11:00:00",
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "General Chemistry",
      code: "CHEM 101",
      instructor: "Dr. Emily Rodriguez",
      credits: 4,
      schedule: "MWF 2:00-3:00 PM",
      room: "Chemistry Lab 201",
      grade: "B+",
      assignments: 10,
      nextClass: "2024-10-15T14:00:00",
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "American History",
      code: "HIST 201",
      instructor: "Prof. David Wilson",
      credits: 3,
      schedule: "TTh 1:00-2:30 PM",
      room: "Humanities 305",
      grade: "B",
      assignments: 5,
      nextClass: "2024-10-15T13:00:00",
      color: "bg-orange-500",
    },
    {
      id: 5,
      name: "Intro to Programming",
      code: "CS 101",
      instructor: "Dr. Alex Kim",
      credits: 4,
      schedule: "MWF 10:00-11:00 AM",
      room: "Computer Lab 150",
      grade: "A",
      assignments: 7,
      nextClass: "2024-10-15T10:00:00",
      color: "bg-red-500",
    },
    {
      id: 6,
      name: "English Composition",
      code: "ENG 101",
      instructor: "Prof. Lisa Brown",
      credits: 3,
      schedule: "TTh 3:00-4:30 PM",
      room: "English Building 220",
      grade: "B-",
      assignments: 4,
      nextClass: "2024-10-15T15:00:00",
      color: "bg-teal-500",
    },
  ];

  const totalCredits = courses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );
  const averageGrade =
    courses.reduce((sum, course) => {
      const gradePoints = {
        A: 4.0,
        "A-": 3.7,
        "B+": 3.3,
        B: 3.0,
        "B-": 2.7,
        "C+": 2.3,
        C: 2.0,
      };
      return (
        sum +
        (gradePoints[
          course.grade as keyof typeof gradePoints
        ] || 0)
      );
    }, 0) / courses.length;

  const formatNextClass = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday =
      date.toDateString() === today.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Courses</h1>
        <p className="text-muted-foreground">
          Manage your enrolled courses and track academic
          progress.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Courses
              </p>
              <p className="font-semibold">{courses.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Credits
              </p>
              <p className="font-semibold">{totalCredits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                GPA
              </p>
              <p className="font-semibold">
                {averageGrade.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Next Class
              </p>
              <p className="font-semibold text-xs">
                In 2 hours
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${course.color}`}
                    />
                    <h3>{course.name}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {course.code}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <Badge
                    variant={
                      course.grade.startsWith("A")
                        ? "default"
                        : course.grade.startsWith("B")
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {course.grade}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {course.credits} credits
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Schedule:
                  </span>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Room:
                  </span>
                  <span>{course.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Next Class:
                  </span>
                  <span>
                    {formatNextClass(course.nextClass)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Assignments:
                  </span>
                  <span>{course.assignments} total</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}