"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description: string;
  course: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete Math Assignment",
      description: "Solve problems 1-20 from chapter 4",
      course: "Calculus I",
      priority: "high",
      completed: false,
      dueDate: "2024-10-15",
    },
    {
      id: 2,
      title: "Read Biology Chapter",
      description: "Read and summarize chapter 5",
      course: "Biology",
      priority: "medium",
      completed: false,
      dueDate: "2024-10-16",
    },
    {
      id: 3,
      title: "Chemistry Lab Report",
      description: "Write report on last week's experiment",
      course: "Chemistry",
      priority: "high",
      completed: true,
      dueDate: "2024-10-14",
    },
    {
      id: 4,
      title: "History Essay Outline",
      description: "Create outline for midterm essay",
      course: "History",
      priority: "low",
      completed: false,
      dueDate: "2024-10-20",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState<{
  title: string;
  description: string;
  course: string;
  priority: Priority;
  dueDate: string;
}>({
  title: "",
  description: "",
  course: "",
  priority: "medium",
  dueDate: "",
});

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...newTask,
          completed: false,
        },
      ]);
      setNewTask({
        title: "",
        description: "",
        course: "",
        priority: "medium",
        dueDate: "",
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tasks</h1>
          <p className="text-muted-foreground">
            Manage your academic tasks and deadlines.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={newTask.course}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      course: e.target.value,
                    })
                  }
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewTask({ ...newTask, priority: value as Priority })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={addTask} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`p-4 ${task.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`font-medium ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
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
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
