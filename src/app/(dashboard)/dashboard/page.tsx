"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  CheckSquare,
  Clock,
  MapPin,
  TrendingUp,
  User,
} from "lucide-react";
// This is your dummy data object. It matches the structure your frontend would create.
const dummyCourseData = {
  courseName: "Introduction to Quantum Computing",
  courseCode: "PHYS451",
  instructor: "Dr. Schrödinger",
  credits: 3,
  color: "#8A2BE2", // A nice purple
  description: "Exploring the principles of quantum mechanics and their application to computation.",
  sessions: [
    {
      day: "Tuesday",
      startTime: "11:00:00",
      endTime: "12:30:00",
      type: "lecture",
      venue: "Quantum Hall, Room 101"
    },
    {
      day: "Thursday",
      startTime: "11:00:00",
      endTime: "12:30:00",
      type: "lecture",
      venue: "Quantum Hall, Room 101"
    },
    {
      day: "Friday",
      startTime: "14:00:00",
      endTime: "16:00:00",
      type: "lab",
      venue: "Simulation Lab B"
    }
  ]
};
// This async function performs the API call.
async function testCreateCourse() {
  console.log("Sending the following data to the API:", dummyCourseData);

  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // We convert our JavaScript object into a JSON string for transport.
      body: JSON.stringify(dummyCourseData),
    });

    // Get the response body as JSON
    const result = await response.json();

    // Check if the HTTP response status is OK (e.g., 200, 201)
    if (!response.ok) {
      // If the server returned an error, log it to the console
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error("Server's error message:", result);
      alert("Failed to create course. Check the console for details.");
    } else {
      // If the request was successful, log the new course data returned by the server
      console.log("✅ Success! Server responded with:", result);
      alert("Course created successfully! Check your database and the console.");
    }

  } catch (error) {
    // This catches network errors (e.g., server is down, no internet)
    console.error("A network or fetch error occurred:", error);
    alert("A network error occurred. Could not reach the server.");
  }
}
export default function Dashboard() {
  const stats = [
    {
      title: "Active Courses",
      value: "6",
      icon: BookOpen,
      color: "text-chart-1",
    },
    {
      title: "Pending Tasks",
      value: "12",
      icon: CheckSquare,
      color: "text-chart-2",
    },
    {
      title: "Hours Studied",
      value: "28.5",
      icon: Clock,
      color: "text-chart-3",
    },
    {
      title: "Average Grade",
      value: "87%",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ];
  const upcomingClasses = [
    {
      id: 1,
      name: "Calculus I",
      code: "MATH 101",
      time: "9:00 AM",
      endTime: "10:00 AM",
      location: "Math Building 205",
      instructor: "Dr. Sarah Johnson",
      color: "bg-blue-500",
      status: "next", // This would be the next class
    },
    {
      id: 2,
      name: "Introduction to Biology",
      code: "BIO 101",
      time: "11:00 AM",
      endTime: "12:30 PM",
      location: "Science Hall 110",
      instructor: "Prof. Michael Chen",
      color: "bg-green-500",
      status: "today",
    },
    {
      id: 3,
      name: "General Chemistry",
      code: "CHEM 101",
      time: "2:00 PM",
      endTime: "3:00 PM",
      location: "Chemistry Lab 201",
      instructor: "Dr. Emily Rodriguez",
      color: "bg-purple-500",
      status: "today",
    },
    {
      id: 4,
      name: "Intro to Programming",
      code: "CS 101",
      time: "10:00 AM",
      endTime: "11:00 AM",
      location: "Computer Lab 150",
      instructor: "Dr. Alex Kim",
      color: "bg-red-500",
      status: "tomorrow",
    },
  ];
  const recentTasks = [
    {
      id: 1,
      title: "Complete Math Assignment",
      course: "Calculus I",
      due: "Today",
      priority: "high",
    },
    {
      id: 2,
      title: "Read Chapter 5",
      course: "Biology",
      due: "Tomorrow",
      priority: "medium",
    },
    {
      id: 3,
      title: "Prepare for Quiz",
      course: "Chemistry",
      due: "Oct 15",
      priority: "high",
    },
    {
      id: 4,
      title: "Submit Lab Report",
      course: "Physics",
      due: "Oct 18",
      priority: "low",
    },
  ];
  const upcomingAssignments = [
    { id: 1, title: "Midterm Exam", course: "Calculus I", due: "Oct 20" },
    { id: 2, title: "Research Paper", course: "History", due: "Oct 25" },
    { id: 3, title: "Group Project", course: "Computer Science", due: "Nov 1" },
  ];

  const formatTimeUntil = (time: string) => {
    // This would calculate actual time until class in a real app
    const current = new Date();
    const hour = parseInt(time.split(":")[0]);
    const isAM = time.includes("AM");
    const targetHour = isAM
      ? hour === 12
        ? 0
        : hour
      : hour === 12
      ? 12
      : hour + 12;

    if (targetHour > current.getHours()) {
      const hoursUntil = targetHour - current.getHours();
      return hoursUntil === 1 ? "in 1 hour" : `in ${hoursUntil} hours`;
    }
    return "now";
  };
  
  // Get current time and day for realistic upcoming classes
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };
  return (
    <>
      <div className="p-3 space-y-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Dashboard
          </h3>
          <p className="text-muted-foreground text-sm">
            Welcome back! Here's your academic overview.
          </p>
          <h2>Testing Area</h2>
      <button 
        onClick={testCreateCourse} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Test Create Course API
      </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Classes
            </h3>
            <div className="space-y-4">
              {upcomingClasses.slice(0, 4).map((classItem) => (
                <div key={classItem.id} className="relative">
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div
                      className={`w-3 h-3 rounded-full ${classItem.color} mt-2 flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">
                          {classItem.name}
                        </h4>
                        <Badge
                          variant={
                            classItem.status === "next"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {classItem.status === "next"
                            ? "Next"
                            : classItem.status === "today"
                            ? "Today"
                            : "Tomorrow"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {classItem.code}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {classItem.time} - {classItem.endTime}
                          </span>
                          {classItem.status === "next" && (
                            <span className="text-primary">
                              ({formatTimeUntil(classItem.time)})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{classItem.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{classItem.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Recent Tasks */}
          <Card className="p-6">
            <h3 className="mb-4">Recent Tasks</h3>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.course}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {task.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <h3 className="mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.course}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Due {assignment.due}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
