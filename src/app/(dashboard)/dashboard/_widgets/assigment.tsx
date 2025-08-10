"use client";

import { useEffect, useState } from "react";

type AssignmentType = "Exam" | "Assignment" | "Project"

type UpcomingAssignments = {
  id: string,
  title: string,
  dueDate: string,
  type: AssignmentType,
  course: string,
}
export default function AssignmentWidget() {
  const [upcomingAssignments, setUpcomingAssignments] = useState<UpcomingAssignments[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    const response = await fetch("/api/dashboard/upcomingAssignments");
    if(!response.ok){
      setLoading(false);
      setError(true);
      console.log("Error occured in the assignment widget");
    }
    const data  = await response.json();
    setUpcomingAssignments(data);
    setLoading(false)
    setError(false);
    console.log(data);
    
  }

  return (
    loading ? (<p>Loading . . . .</p>):(
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
            Due {assignment.dueDate}
          </span>
        </div>
      ))}
    </div>
    )
  );
}
