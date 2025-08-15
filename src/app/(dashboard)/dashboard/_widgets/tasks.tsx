"use client";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  priority: Priority;
  due_date: string;
};

export default function TasksWidget() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    const response = await fetch("/api/dashboard/recentTasks");
    if (!response.ok) {
      setLoading(false);
      setError(true);
      console.log("Error occured in the assignment widget");
    }
    const data = await response.json();
    setRecentTasks(data===null? [] : data);
    setLoading(false);
    setError(false);
    // console.log(data);
  };

  return loading ? (
    <div className="grid place-items-center"><MoonLoader size={30} speedMultiplier={0.6} /></div>
  ) : (
    <div className="space-y-3">
      {recentTasks.length===0 ? <p>Hurrah! No tasks pending</p>  :
      recentTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div className="flex-1">
            <p className="font-medium">{task.title}</p>
            <span className="text-sm text-muted-foreground">
              Due: {task.due_date}
            </span>
          </div>
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
        </div>
      ))}
    </div>
  );
}
