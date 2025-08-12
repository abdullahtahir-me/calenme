"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Plus,
  MapPin,
  User,
  Calendar,
  GraduationCap,
  Beaker,
  X,
  Edit,
  Loader2Icon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ClassSession = {
  day: string;
  startTime: string;
  endTime: string;
  type: "lecture" | "lab";
  venue: string;
};

type Course = {
  id: string;
  title: string;
  code: string;
  professor_name: string;
  credits: number;
  assignments: number;
  color: string;
  description?: string;
  sessions: ClassSession[];
  nextClass?: {
    date: string;
    time: string;
    type: "lecture" | "lab";
    venue: string;
  };
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log("fetching the data");
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Error fetching the results");
      }
      const data = await response.json();
      console.log("data fetched succgull");
      console.log(data);
      setCourses(data===null?[]:data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occured");
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseCode: "",
    instructor: "",
    credits: 3,
    description: "",
    color: "bg-blue-500",
    sessions: [] as ClassSession[],
  });
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [sameVenue, setSameVenue] = useState(true);
  const [commonVenue, setCommonVenue] = useState("");

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        type: "lecture",
        venue: sameVenue ? commonVenue : "",
      },
    ]);
  };

  const updateSession = (
    index: number,
    field: keyof ClassSession,
    value: string
  ) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleAddCourse = async () => {
    setAddLoading(true);
    newCourse.sessions = sessions;
    console.log("Sending the following data to the API:", newCourse);
    console.log(sessions);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We convert our JavaScript object into a JSON string for transport.
        body: JSON.stringify(newCourse),
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
        console.log("Success! Server responded with:", result);
        fetchCourses();
        // alert("Course created successfully! Check your database and the console.");
      }
      setShowAddDialog(false);
      setAddLoading(false)
    } catch (error) {
      // This catches network errors (e.g., server is down, no internet)
      console.error("A network or fetch error occurred:", error);
      alert("A network error occurred. Could not reach the server.");
    }

    setSessions([]);
    setNewCourse({
      courseName: "",
      courseCode: "",
      instructor: "",
      credits: 3,
      description: "",
      color: "bg-blue-500",
      sessions: [],
    });
    setEnableSchedule(false);
    setSameVenue(true);
    setCommonVenue("");
  };

  const handleRemoveCourse = async (id: string) => {
    setDeleteLoading(id);
    console.log("delete course request");
    const response = await fetch(`/api/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Error deleting the course.");
    }
    fetchCourses();
    setDeleteLoading("")
  };

  const getNextClassTime = (course: Course) => {
    if (course.nextClass) {
      return `${course.nextClass.date} at ${course.nextClass.time}`;
    }
    return "No upcoming class";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Courses</h1>
          <p className="text-muted-foreground">
            Manage your enrolled courses and track academic progress.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={newCourse.courseName}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, courseName: e.target.value })
                    }
                    placeholder="e.g. Calculus I"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={newCourse.courseCode}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, courseCode: e.target.value })
                    }
                    placeholder="e.g. MATH 101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, instructor: e.target.value })
                    }
                    placeholder="e.g. Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Select
                    value={newCourse.credits.toString()}
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, credits: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                      <SelectItem value="5">5 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Brief description of the course"
                />
              </div>

              <div>
                <Label>Course Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCourse({ ...newCourse, color })}
                      className={`w-8 h-8 rounded-full ${color} ${
                        newCourse.color === color
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="schedule"
                  checked={enableSchedule}
                  onCheckedChange={setEnableSchedule}
                />
                <Label htmlFor="schedule">Add Schedule</Label>
              </div>

              {enableSchedule && (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Class Schedule</h4>
                    <Button size="sm" onClick={addSession}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Session
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sameVenue"
                      checked={sameVenue}
                      onCheckedChange={setSameVenue}
                    />
                    <Label htmlFor="sameVenue">
                      Same venue for all sessions
                    </Label>
                  </div>

                  {sameVenue && (
                    <div>
                      <Label htmlFor="commonVenue">Common Venue</Label>
                      <Input
                        id="commonVenue"
                        value={commonVenue}
                        onChange={(e) => setCommonVenue(e.target.value)}
                        placeholder="e.g. Science Building 101"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-6 gap-2 items-end p-3 border rounded"
                      >
                        <div>
                          <Label className="text-xs">Day</Label>
                          <Select
                            value={session.day}
                            onValueChange={(value) =>
                              updateSession(index, "day", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                              ].map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day.slice(0, 3)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Start</Label>
                          <Input
                            type="time"
                            value={session.startTime}
                            onChange={(e) =>
                              updateSession(index, "startTime", e.target.value)
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End</Label>
                          <Input
                            type="time"
                            value={session.endTime}
                            onChange={(e) =>
                              updateSession(index, "endTime", e.target.value)
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={session.type}
                            onValueChange={(value: "lecture" | "lab") =>
                              updateSession(index, "type", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lecture">Lecture</SelectItem>
                              <SelectItem value="lab">Lab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {!sameVenue && (
                          <div>
                            <Label className="text-xs">Venue</Label>
                            <Input
                              value={session.venue}
                              onChange={(e) =>
                                updateSession(index, "venue", e.target.value)
                              }
                              placeholder="Room/Building"
                              className="h-8"
                            />
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSession(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCourse}disabled={addLoading}>{addLoading ? <Loader2Icon className="animate-spin" /> : "Add Course"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
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
              <p className="text-sm text-muted-foreground">Total Credits</p>
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
              <p className="text-sm text-muted-foreground">GPA</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Class</p>
              <p className="font-semibold text-xs">In 2 hours</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
                <Skeleton className="rounded-xl p-5 space-y-3" key={i}>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-60 bg-zinc-200" />
                    <Skeleton className="h-5 w-15 bg-zinc-200" />
                  </div>
                    <Skeleton className="h-4 w-30 bg-zinc-200" />
                    <Skeleton className="h-30  bg-zinc-200" />
                  <div className="flex space-x-3 justify-between">
                    <Skeleton className="h-4 w-[150px] bg-zinc-200" />
                    <Skeleton className="h-4 w-[50px] bg-zinc-200" />
                  </div>
                </Skeleton>
            ))
          : courses.map((course) => (
              <Dialog key={course.id}>
                <DialogTrigger asChild>
                  <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${course.color}`}
                            />
                            <h3>{course.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{course.code}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{course.professor_name}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {course.credits} credits
                          </p>
                        </div>
                      </div>

                      {/* Next Class Info */}
                      {course.sessions && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">
                              Next Class
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {course.sessions.at(0)?.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{`On ${
                                course.sessions.at(0)?.day
                              } at ${course.sessions
                                .at(0)
                                ?.startTime.substring(0, 5)}`}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{course.sessions.at(0)?.venue}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Assignments:
                        </span>
                        <span>{course.assignments} total</span>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${course.color}`} />
                      {course.title} ({course.code})
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Instructor
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {course.professor_name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Credits</Label>
                        <p className="text-sm text-muted-foreground">
                          {course.credits}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Assignments
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {course.assignments} total
                        </p>
                      </div>
                    </div>

                    {course.description && (
                      <div>
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.description}
                        </p>
                      </div>
                    )}

                    {course.sessions?.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Full Schedule
                        </Label>
                        <div className="space-y-3">
                          {course.sessions.map((session, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  {session.type === "lecture" ? (
                                    <GraduationCap className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <Beaker className="h-4 w-4 text-green-500" />
                                  )}
                                  <Badge
                                    variant={
                                      session.type === "lecture"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {session.type}
                                  </Badge>
                                </div>
                                <span className="font-medium">
                                  {session.day}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {session.startTime} - {session.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{session.venue}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveCourse(course.id)}
                    disabled={deleteLoading==course.id}
                  >{deleteLoading==course.id ? <Loader2Icon className="animate-spin" />: "Delete Course" }
                  </Button>
                </DialogContent>
              </Dialog>
            ))}
      </div>
    </div>
  );
}
