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
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect } from 'react';
import { getCounselors } from '@/lib/actions';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

export function RequestAppointmentForm() {
  const { toast } = useToast();
  const [counselors, setCounselors] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounselors() {
      setIsLoadingCounselors(true);
      setCounselorError(null);
      const result = await getCounselors();
      if ('error' in result) {
        setCounselorError(result.error);
        toast({
          variant: "destructive",
          title: "Failed to Load Counselors",
          description: result.error,
        });
      } else {
        setCounselors(result);
      }
      setIsLoadingCounselors(false);
    }
    fetchCounselors();
  }, [toast]);

  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(AppointmentRequestSchema),
    defaultValues: {
      counselorId: '',
      reason: '',
      communicationMode: undefined,
    },
  });

  async function onSubmit(values: AppointmentRequestInput) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(values);
    toast({
      title: 'Appointment Request Submitted',
      description: 'Your request has been sent. You will be notified once confirmed.',
    });
    form.reset();
  }

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
                disabled={isLoadingCounselors || counselors.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingCounselors
                        ? "Loading counselors..."
                        : counselorError
                        ? "Error: Could not load counselors"
                        : counselors.length === 0
                        ? "No counselors available"
                        : "Select a counselor if you have a preference"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCounselors ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    counselors.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {counselorError && <FormDescription className="text-destructive">{counselorError}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                />
              </FormControl>
              <FormDescription>
                This will help your counselor prepare for the session.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Request Appointment'}
        </Button>
      </form>
    </Form>
  );
}
