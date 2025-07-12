
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus, Loader2, AlertTriangle } from "lucide-react";
import { StudentOverviewCard } from "@/components/dashboard/StudentOverviewCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAssignedStudents } from "@/lib/actions";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <Card key={i} className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4 p-5">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </CardContent>
                <CardContent className="p-4 pt-2 border-t">
                    <Skeleton className="h-9 w-full rounded-md" />
                </CardContent>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">Manage profiles and notes for your assigned students.</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
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
        renderSkeleton()
      ) : error ? (
        <Card className="bg-destructive/10 border-destructive col-span-full">
          <CardContent className="p-6 text-center text-destructive-foreground">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p className="font-semibold">Failed to load students</p>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <StudentOverviewCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="col-span-full shadow-lg">
          <CardContent className="py-12 text-center flex flex-col items-center justify-center">
             <div className="bg-secondary p-6 rounded-full mb-6">
                <Users className="h-12 w-12 text-muted-foreground" />
            </div>
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
