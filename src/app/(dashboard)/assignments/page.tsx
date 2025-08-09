"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

type assignmentType = "Exam" | "Project" | "Assignment";
type Assignment = {
  id: string;
  course: string;
  title: string;
  type: assignmentType;
  description: string;
  dueDate: Date;
  completed: boolean;
};
type newAssignment = {
  course_id: string;
  title: string;
  type: assignmentType;
  description: string;
  dueDate: Date | null;
  completed: boolean;
};
type Course = {
  id: string;
  title: string;
  code: string;
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newAssignment, setNewAssignment] = useState<newAssignment>({
    title: "",
    course_id: "",
    type: "Assignment",
    dueDate: null,
    completed: false,
    description: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);

  const assignmentsdata: Assignment[] = [
    {
      id: "1",
      title: "Calculus Midterm Exam",
      course: "Calculus I",
      type: "Exam",
      dueDate: new Date("2024-10-20"),
      completed: true,
      description: "Comprehensive exam covering chapters 1-6",
    },
    {
      id: "2",
      title: "History Research Paper",
      course: "American History",
      type: "Exam",
      dueDate: new Date("2024-10-25"),
      completed: false,
      description: "15-page research paper on the Industrial Revolution",
    },
  ];

  useEffect(() => {
    fetchAssignments();
    getCourse();
  }, []);

  const getStatusColor = (status: boolean) => {
    if (status) return "bg-green-500";
    return "bg-gray-400";
  };
  const getStatusText = (status: boolean) => {
    if (status) return "Completed";
    return "Pending";
  };
  const getDaysUntilDue = (dueDate: Date) => {
    if (!dueDate) {
    return null; // Or return a large number, or some other default
  }

  const today = new Date();
  // 2. THIS IS THE FIX: Create a new Date object from the incoming string.
  //    The `new Date()` constructor is excellent at parsing ISO date strings.
  const due = new Date(dueDate);

  // 3. Check if the date was valid. If an invalid string was passed,
  //    `due.getTime()` will be NaN (Not a Number).
  if (isNaN(due.getTime())) {
    return null;
  }

  // Set both dates to the start of their respective days for an accurate day count
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
    // 
  };
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getCourse = async () => {
    const response = await fetch("/api/courses?query=coursesName");
    if (!response.ok) console.log("error loading the courses details");
    const data = await response.json();
    console.log(data);
    setCourses(data);
  };

  const fetchAssignments = async () => {
    const response = await fetch("/api/assignments");
    if(!response.ok){
      console.log("error fetching the courses")
    }
    const data = await response.json();
    setAssignments(data);
  }

  const handleAddAssignment = async () => {
    console.log(newAssignment);
    setShowAddDialog(false)
    const response = await fetch("/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAssignment),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error("Server's error message:", result);
      alert("Error entering the assignment");
    }
    fetchAssignments();
    // alert("Successfull");
    setNewAssignment({
      title: "",
      course_id: "",
      type: "Assignment",
      dueDate: null,
      completed: false,
      description: "",
    });

  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Assignments</h1>
        <p className="text-muted-foreground">
          Track your major assignments and their progress.
        </p>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add assignment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Assignsment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  placeholder="Title"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueDate: new Date(e.target.value),
                    })
                  }
                  placeholder="DueDate"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 space-y-4 md:grid-cols-2 ">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newAssignment.type}
                  onValueChange={(value) =>
                    setNewAssignment({
                      ...newAssignment,
                      type: value as assignmentType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="course">Course</Label>
                <Select
                  value={newAssignment.course_id}
                  onValueChange={(value) =>
                    setNewAssignment({ ...newAssignment, course_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => {
                      return (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAssignment}>Add Assignment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="font-semibold">{assignments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="font-semibold">
                {assignments.filter((a) => !a.completed).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-semibold">
                {assignments.filter((a) => a.completed).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);

          return (
            <Card key={assignment.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3>{assignment.title}</h3>
                      <Badge variant="outline">{assignment.type}</Badge>
                    </div>
                    <p className="text-muted-foreground">{assignment.course}</p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          assignment.completed
                        )}`}
                      />
                      <span className="text-sm">
                        {getStatusText(assignment.completed)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    {(daysUntilDue!== null && daysUntilDue >= 0) && (
                      <p
                        className={`text-sm ${
                          daysUntilDue <= 3
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {daysUntilDue === 0
                          ? "Due today"
                          : daysUntilDue === 1
                          ? "Due tomorrow"
                          : `${daysUntilDue} days left`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Details
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
