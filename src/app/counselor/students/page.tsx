
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus, Loader2, AlertTriangle } from "lucide-react";
import { StudentOverviewCard } from "@/components/dashboard/StudentOverviewCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAssignedStudents } from "@/lib/actions";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
            <p className="text-muted-foreground">Manage profiles and notes for your assigned students.</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-auto max-w-sm">
            <Input 
              type="search" 
              placeholder="Search students..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" disabled>
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i} className="h-48 animate-pulse bg-muted" />)}
        </div>
      ) : error ? (
        <Card className="bg-destructive/10 border-destructive col-span-full">
          <CardContent className="p-6 text-center text-destructive-foreground">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p className="font-semibold">Failed to load students</p>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="col-span-full border-dashed">
          <CardContent className="pt-10 pb-8 text-center">
            <Image src="https://placehold.co/200x150.png" alt="No results" width={150} height={112} className="mx-auto mb-6 rounded-lg" data-ai-hint="magnifying glass empty results" />
            <h3 className="text-xl font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No students match your search, or no students have been assigned yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
