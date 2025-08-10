// app/(dashboard)/dashboard/_cards/UpcomingAssignmentsData.tsx
type UpcomingAssignment = {
  id: string;
  title: string;
  due_date: string;
  type: string;
  courses?: { title: string };
};

export default async function UpcomingAssignmentsData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/stats`, {
    cache: "no-store", // ensure fresh data
  });

  if (!res.ok) {
    return <div>Error loading assignments</div>;
  }

  const upcomingAssignments: UpcomingAssignment[] = await res.json();

  return (
    <div className="space-y-3">
      {upcomingAssignments.map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-center justify-between p-3 border border-border rounded-lg"
        >
          <div>
            <p className="font-medium">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">
              {assignment.courses?.title}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Due {assignment.due_date}
          </span>
        </div>
      ))}
    </div>
  );
}
