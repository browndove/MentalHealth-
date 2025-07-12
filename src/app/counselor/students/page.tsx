
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus, Loader2 } from "lucide-react";
import { StudentOverviewCard } from "@/components/dashboard/StudentOverviewCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAssignedStudents } from "@/lib/actions";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string;
  name: string;
  universityId: string;
  lastSession?: string;
  nextSession?: string;
  avatarUrl?: string;
  aiHint?: string;
};

export default function CounselorStudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAssignedStudents(user.uid);
      if (result.error) throw new Error(result.error);
      setAllStudents(result.data || []);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Failed to load students", description: err.message });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  const filteredStudents = allStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.universityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">My Students</h1>
        </div>
        <div className="flex gap-2 items-center">
            <div className="relative w-full md:w-auto max-w-sm">
            <Input 
              type="search" 
              placeholder="Search students by name or ID..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        {allStudents.length > 12 && <Button variant="outline">Load More Students</Button>}
      </div>
    </div>
  );
}
