import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Clock } from "lucide-react"

export function Assignments() {
  const assignments = [
    {
      id: 1,
      title: "Calculus Midterm Exam",
      course: "Calculus I",
      type: "Exam",
      dueDate: "2024-10-20",
      status: "in-progress",
      description: "Comprehensive exam covering chapters 1-6",
      weight: "25%"
    },
    {
      id: 2,
      title: "History Research Paper",
      course: "American History",
      type: "Paper",
      dueDate: "2024-10-25",
      status: "in-progress",
      description: "15-page research paper on the Industrial Revolution",
      weight: "30%"
    },
    {
      id: 3,
      title: "Computer Science Project",
      course: "Intro to Programming",
      type: "Project",
      dueDate: "2024-11-01",
      status: "in-progress",
      description: "Build a web application using React",
      weight: "40%"
    },
    {
      id: 4,
      title: "Biology Lab Final",
      course: "Biology 101",
      type: "Lab",
      dueDate: "2024-10-18",
      status: "completed",
      description: "Complete analysis of microscopy samples",
      weight: "15%"
    },
    {
      id: 5,
      title: "Chemistry Problem Set",
      course: "General Chemistry",
      type: "Homework",
      dueDate: "2024-10-22",
      status: "not-started",
      description: "Solve problems 1-50 from chapter 8",
      weight: "10%"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'not-started': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'not-started': return 'Not Started'
      default: return 'Unknown'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Assignments</h1>
        <p className="text-muted-foreground">Track your major assignments and their progress.</p>
      </div>

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
              <p className="font-semibold">{assignments.filter(a => a.status === 'in-progress').length}</p>
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
              <p className="font-semibold">{assignments.filter(a => a.status === 'completed').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          
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
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(assignment.status)}`} />
                      <span className="text-sm">{getStatusText(assignment.status)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Weight: {assignment.weight}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    {daysUntilDue >= 0 && (
                      <p className={`text-sm ${daysUntilDue <= 3 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {daysUntilDue === 0 ? 'Due today' : 
                         daysUntilDue === 1 ? 'Due tomorrow' : 
                         `${daysUntilDue} days left`}
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
          )
        })}
      </div>
    </div>
  )
}