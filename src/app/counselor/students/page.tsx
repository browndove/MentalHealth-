
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus, Loader2, AlertTriangle, MessageSquare, Download, Filter } from "lucide-react";
import { StudentOverviewCard } from "@/components/dashboard/StudentOverviewCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAssignedStudents } from "@/lib/actions";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";

type Student = {
  id: string;
  name:string;
  universityId: string;
  lastSession?: string;
  nextSession?: string;
  avatarUrl?: string;
  aiHint?: string;
  status: 'Active' | 'Inactive' | 'Needs Follow-up' | 'New';
};

export default function CounselorStudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAssignedStudents(user.uid);
      if (result.error) throw new Error(result.error);
      
      const studentsWithStatus = (result.data || []).map(s => {
        let status: Student['status'] = 'New';
        if (s.nextSession) status = 'Active';
        else if (s.lastSession) {
           const lastSessionDate = new Date(s.lastSession);
           const daysSince = (new Date().getTime() - lastSessionDate.getTime()) / (1000 * 3600 * 24);
           if(daysSince > 30) status = 'Needs Follow-up';
           else status = 'Inactive';
        }
        return { ...s, status };
      });
      setAllStudents(studentsWithStatus);

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
  
  const sortedAndFilteredStudents = useMemo(() => {
     return allStudents
        .filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  student.universityId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || student.status.toLowerCase().replace(' ', '-') === selectedStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch(sortOrder) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'last-session':
                    // Students with no last session date are sorted to the end.
                    if (!a.lastSession) return 1;
                    if (!b.lastSession) return -1;
                    return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime();
                default:
                    return 0;
            }
        });
  }, [allStudents, searchTerm, selectedStatus, sortOrder]);
  
  const handleSelectStudent = (studentId: string, isSelected: boolean) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(studentId);
      } else {
        newSet.delete(studentId);
      }
      return newSet;
    });
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <Card key={i}>
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
                <CardFooter className="p-4 pt-2 border-t">
                    <Skeleton className="h-9 w-full rounded-md" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">Manage profiles, sessions, and notes for your assigned students.</p>
        </div>
        <Button variant="outline" disabled>
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full md:w-auto">
              <Input 
                type="search" 
                placeholder="Search by name or ID..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="needs-follow-up">Needs Follow-up</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="last-session">Last Session (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </CardContent>
      </Card>
      
      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedStudents.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-3 flex items-center justify-between">
                <p className="text-sm font-medium">{selectedStudents.size} student{selectedStudents.size > 1 ? 's' : ''} selected</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4" /> Bulk Message</Button>
                  <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStudents(new Set())}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Grid */}
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
      ) : sortedAndFilteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredStudents.map(student => (
            <StudentOverviewCard 
              key={student.id} 
              student={student}
              isSelected={selectedStudents.has(student.id)}
              onSelectionChange={handleSelectStudent}
            />
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
          <CardContent className="py-12 text-center flex flex-col items-center justify-center">
             <div className="bg-secondary p-6 rounded-full mb-6">
                <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No students match your search or filter criteria. Try adjusting your search.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
