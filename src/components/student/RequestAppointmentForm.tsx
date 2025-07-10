
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AppointmentRequestSchema, type AppointmentRequestInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect, useCallback } from 'react';
import { getCounselors, requestAppointment } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function RequestAppointmentForm() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Use auth loading state
  const [counselors, setCounselors] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCounselors = useCallback(async () => {
    // Ensure user is loaded and authenticated before fetching
    if (authLoading) {
      return; // Wait for authentication to resolve
    }
    if (!user) {
      setCounselorError("You must be logged in to see available counselors.");
      setIsLoadingCounselors(false);
      return;
    }

    setIsLoadingCounselors(true);
    setCounselorError(null);
    const result = await getCounselors(user.uid);
    if ('error' in result) {
      setCounselorError(result.error);
    } else {
      setCounselors(result.data);
    }
    setIsLoadingCounselors(false);
  }, [user, authLoading]);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(AppointmentRequestSchema),
    defaultValues: {
      counselorId: '',
      reason: '',
      communicationMode: undefined,
    },
  });

  async function onSubmit(values: AppointmentRequestInput) {
    if (!user || !user.fullName) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to request an appointment.',
      });
      return;
    }
    setIsSubmitting(true);
    const result = await requestAppointment(values, user.uid, user.fullName);
    
    if ('error' in result) {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: result.error,
        });
    } else {
        toast({
          title: 'Appointment Request Submitted',
          description: 'Your request has been sent. You will be notified once confirmed.',
        });
        form.reset();
    }
    setIsSubmitting(false);
  }

  const isFormDisabled = authLoading || isLoadingCounselors || !!counselorError || !user;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="counselorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Counselor (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormDisabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      authLoading ? "Verifying user..." :
                      isLoadingCounselors
                        ? "Loading counselors..."
                        : counselorError
                        ? "Could not load counselors"
                        : counselors.length === 0
                        ? "No counselors available"
                        : "Select a counselor if you have a preference"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {counselors.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {counselorError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could Not Load Counselors</AlertTitle>
            <AlertDescription className="space-y-2">
              <p className="whitespace-pre-wrap">{counselorError}</p>
               <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={fetchCounselors} disabled={authLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isFormDisabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormDisabled}>
                  <FormControl>
                    <SelectTrigger>
                       <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="communicationMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormDisabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how you'd like to communicate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="chat">Chat Session</SelectItem>
                  <SelectItem value="in-person">In-Person (if available)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Appointment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe what you'd like to discuss (e.g., stress, anxiety, academic pressure)."
                  className="resize-none"
                  rows={4}
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormDescription>
                This will help your counselor prepare for the session.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || isFormDisabled}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Request Appointment'}
        </Button>
      </form>
    </Form>
  );
}
