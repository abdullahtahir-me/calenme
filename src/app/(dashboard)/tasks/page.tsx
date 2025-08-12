"use client";
import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
type Priority = "low" | "medium" | "high";

interface Task {
  created_at: string | number | Date;
  id: number;
  title: string;
  description: string;
  course: string;
  priority: Priority;
  completed: boolean;
  due_date: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);


  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Error fetching the results");
        setLoading(false);
      }
      const data = await response.json();
      setTasks(data);
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
    fetchTasks();
  }, []);

  const toggleTask = async (id: number, completed: boolean) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toggledState: !completed }),
    });
    if (response.ok) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const addTask = async () => {
    if (title.trim()) {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate,
        }),
      });
      if (!response.ok) {
        // Handle errors from the server
        const errorData = await response.json();
        console.error("Failed to add task:", errorData.error);
        alert(`Error: ${errorData.error}`);
      } else {
        // Success!
        const createdTask = await response.json();
        console.log("Task added successfully:", createdTask);
        // alert("Task added!");
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate(null);
        setShowAddDialog(false)
        fetchTasks();
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });
  // console.log(tasks);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tasks</h1>
          <p className="text-muted-foreground">
            Manage your academic tasks and deadlines.
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value: string) => {
                    setPriority(value as Priority);
                  }}
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
                  value={dueDate ? dueDate : ""}
                  onChange={(e) => setDueDate(e.target.value)}
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
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="h-20 rounded-xl flex items-center justify-between p-5">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 bg-zinc-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-zinc-200" />
                  <Skeleton className="h-4 w-[300px] bg-zinc-200" />
                </div>
              </div>
              <div className="flex space-x-3">
                <Skeleton className="h-4 w-[50px] bg-zinc-200" />
                <Skeleton className="h-4 w-[150px] bg-zinc-200" />
              </div>
            </Skeleton>
          </div>
        ))) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 ${task.completed ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
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
                        {task.due_date &&
                          "Due:" +
                            new Date(task.due_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
