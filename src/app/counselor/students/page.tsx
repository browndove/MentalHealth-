import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus, FileText, MessageSquare } from "lucide-react";
import { StudentOverviewCard } from "@/components/dashboard/StudentOverviewCard";
import Link from "next/link";

const allStudents = [
  { id: 's1', name: 'Aisha Bello', universityId: 'ATU005678', lastSession: '2024-07-28', nextSession: '2024-08-10', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student" },
  { id: 's2', name: 'Kwame Annan', universityId: 'ATU001234', lastSession: '2024-07-25', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "male student"  },
  { id: 's3', name: 'Fatima Ibrahim', universityId: 'ATU009012', nextSession: '2024-08-12', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student smiling" },
  { id: 's4', name: 'Chinedu Okoro', universityId: 'ATU003322', lastSession: '2024-07-15', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "male student glasses" },
  { id: 's5', name: 'Amina Yusuf', universityId: 'ATU004411', nextSession: '2024-08-20', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "female student thinking" },
  { id: 's6', name: 'John Mensah', universityId: 'ATU007788', lastSession: '2024-06-30', avatarUrl: 'https://placehold.co/64x64.png', aiHint: "male student laptop" },
];


export default function CounselorStudentsPage() {
  // Add search/filter state and logic here in a real app
  const filteredStudents = allStudents;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">My Students</h1>
        </div>
        <div className="flex gap-2 items-center">
            <div className="relative w-full md:w-auto max-w-sm">
            <Input type="search" placeholder="Search students by name or ID..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="outline" disabled>
                <UserPlus className="mr-2 h-4 w-4" /> Add Student (Admin)
            </Button>
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        View and manage profiles, session history, and notes for your assigned students.
      </p>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No students found matching your criteria, or no students assigned yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="text-center mt-8">
        {/* Pagination would go here if many students */}
        {filteredStudents.length > 5 && <Button variant="outline">Load More Students</Button>}
      </div>
    </div>
  );
}
