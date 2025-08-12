"use client";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckSquare, Clock, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import AssignmentWidget from "./_widgets/assigment";
import TasksWidget from "./_widgets/tasks";
import ScheduleWidget from "./_widgets/schedule";
import { MoonLoader } from "react-spinners";


export default function Dashboard() {
  useEffect(() => {
    fetchData();
  }, [])

  const [activeCourses, setActiveCourses] = useState("");
  const [pendingAssignments, setPendingAssignments] = useState("")
  const [pendingTasks, setPendingTasks] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch("/api/dashboard");
    if (!response.ok) {
      alert("Can't fetch the stats")
      setLoading(false)
    }
    const data = await response.json();
    setActiveCourses(data.courses);
    setPendingAssignments(data.assignments);
    setPendingTasks(data.tasks);
    setLoading(false)
  }


  const stats = [
    {
      title: "Active Courses",
      value: activeCourses,
      icon: BookOpen,
      color: "text-chart-1",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: CheckSquare,
      color: "text-chart-2",
    },
    {
      title: "Pending Assignments",
      value: pendingAssignments,
      icon: Clock,
      color: "text-chart-3",
    },
  ];
  

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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{loading ? <Loader2Icon className="animate-spin" /> :stat.value}</p>
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
            <ScheduleWidget />
          </Card>
          {/* Recent Tasks */}
          <Card className="p-6">
            <h3 className="mb-4">Recent Tasks</h3>
            <TasksWidget />
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <h3 className="mb-4">Upcoming Assignments</h3>
            <AssignmentWidget />
          </Card>
        </div>
      </div>
    </>
  );
}
