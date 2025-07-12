
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { 
  CalendarIcon, 
  Clock, 
  Loader2, 
  RefreshCw, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Video, 
  User,
  Info,
  HeartPulse,
  Smile,
  ChevronDown
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect, useCallback } from 'react';
import { getCounselors, requestAppointment } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CounselorSelectionCard } from './CounselorSelectionCard';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
const commonTopics = ["Stress", "Anxiety", "Relationships", "Academic Pressure", "Depression", "Family Issues", "Time Management", "Other"];

export function RequestAppointmentForm() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [counselors, setCounselors] = useState<any[]>([]);
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(AppointmentRequestSchema),
    defaultValues: {
      preferredCounselorId: undefined,
      sessionType: undefined,
      duration: 30,
      isFollowUp: false,
      reasonForAppointment: '',
      urgencyLevel: 'Routine',
      specificTopics: [],
      moodRating: 3,
      hasEmergencyContact: false,
    },
  });

  const selectedDate = form.watch('preferredDate');

  useEffect(() => {
    if (selectedDate) {
      setIsCheckingSlots(true);
      setTimeout(() => {
        const randomSlots = allTimeSlots.filter(() => Math.random() > 0.3);
        setAvailableSlots(randomSlots);
        setIsCheckingSlots(false);
      }, 500);
    } else {
      setAvailableSlots([]);
    }
    form.setValue('preferredTimeSlot', '');
  }, [selectedDate, form]);

  const fetchCounselors = useCallback(async () => {
    if (authLoading) return;
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
      // Add specialties for the UI
      const mockSpecialties = [['CBT', 'Anxiety'], ['Stress Mgmt', 'Relationships'], ['Trauma', 'Grief']];
      setCounselors(result.data.map((c, i) => ({ ...c, specialties: mockSpecialties[i % mockSpecialties.length] })));
    }
    setIsLoadingCounselors(false);
  }, [user, authLoading]);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  async function onSubmit(values: AppointmentRequestInput) {
    if (!user || !user.fullName) {
      toast({ variant: 'destructive', title: 'Authentication Error' });
      return;
    }
    setIsSubmitting(true);
    
    const result = await requestAppointment(values, user.uid, user.fullName);
    
    if (result.success) {
        toast({
          title: 'Appointment Request Submitted!',
          description: 'Your request has been sent. You will be notified once confirmed.',
        });
        form.reset();
        setAvailableSlots([]);
    } else {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: result.error,
        });
    }

    setIsSubmitting(false);
  }

  const isFormDisabled = authLoading || isSubmitting;
  const mood = form.watch('moodRating');
  const moodEmojis = ['😔', '😕', '😐', '🙂', '😄'];
  const hasEmergencyContact = form.watch('hasEmergencyContact');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-6">
          
          {/* Section 1: Scheduling and Counselor */}
          <AccordionItem value="item-1" className="border rounded-xl shadow-sm bg-card overflow-hidden">
            <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg"><CalendarIcon className="h-6 w-6" /></div>
                1. Scheduling & Counselor
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-8">
              <div>
                <Label className="text-base font-medium">Preferred Counselor</Label>
                <p className="text-sm text-muted-foreground mb-4">You can select a specific counselor or leave it for us to assign one.</p>
                {isLoadingCounselors ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Skeleton className="h-24 w-full" />
                     <Skeleton className="h-24 w-full" />
                   </div>
                ) : counselorError ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Could Not Load Counselors</AlertTitle>
                  </Alert>
                ) : (
                  <FormField
                    control={form.control}
                    name="preferredCounselorId"
                    render={({ field }) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <Controller
                            name="preferredCounselorId"
                            control={form.control}
                            render={({ field }) => (
                                <>
                                {counselors.map(c => (
                                    <CounselorSelectionCard
                                        key={c.id}
                                        counselor={c}
                                        isSelected={field.value === c.id}
                                        onSelect={() => field.onChange(c.id)}
                                    />
                                    ))}
                                </>
                            )}
                         />
                      </div>
                    )}
                  />
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-base font-medium">Select a Date</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 text-base", !field.value && "text-muted-foreground")} disabled={isFormDisabled}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredTimeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium">Available Times {isCheckingSlots && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}</FormLabel>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-3" disabled={isFormDisabled || !selectedDate || isCheckingSlots}>
                           {availableSlots.length > 0 ? availableSlots.map(time => (
                             <FormItem key={time}>
                               <FormControl>
                                  <RadioGroupItem value={time} id={time} className="sr-only" />
                               </FormControl>
                               <Label htmlFor={time} className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                 <Clock className="h-4 w-4" />
                                 {time}
                               </Label>
                             </FormItem>
                           )) : (
                              <div className="col-span-2 text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
                                  {isCheckingSlots ? "Checking..." : "Select a date to see times."}
                              </div>
                           )}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Session and Appointment Details */}
          <AccordionItem value="item-2" className="border rounded-xl shadow-sm bg-card overflow-hidden">
             <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                 <div className="bg-primary/10 text-primary p-2 rounded-lg"><Info className="h-6 w-6" /></div>
                2. Session & Appointment Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="sessionType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Session Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormDisabled}>
                          <FormControl><SelectTrigger className="h-12"><SelectValue placeholder="Select how you'd like to meet" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Video Call"><Video className="inline-block mr-2 h-4 w-4"/>Video Call</SelectItem>
                            <SelectItem value="Chat"><MessageSquare className="inline-block mr-2 h-4 w-4"/>Chat Session</SelectItem>
                            <SelectItem value="In-Person"><User className="inline-block mr-2 h-4 w-4"/>In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="duration" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Session Duration</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)} disabled={isFormDisabled}>
                           <FormControl><SelectTrigger className="h-12"><SelectValue placeholder="Select session length" /></SelectTrigger></FormControl>
                           <SelectContent>
                             <SelectItem value="30">30 minutes</SelectItem>
                             <SelectItem value="45">45 minutes</SelectItem>
                             <SelectItem value="60">60 minutes</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="reasonForAppointment" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">What would you like to discuss?</FormLabel>
                    <FormControl><Textarea placeholder="Briefly describe what's on your mind. This is confidential and helps your counselor prepare." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="specificTopics" render={() => (
                  <FormItem>
                     <FormLabel className="text-base">Are there any specific topics you want to cover?</FormLabel>
                     <p className="text-sm text-muted-foreground">Select all that apply. This is optional.</p>
                     <div className="flex flex-wrap gap-2 pt-2">
                        {commonTopics.map(topic => (
                           <FormField key={topic} control={form.control} name="specificTopics" render={({ field }) => (
                              <FormItem key={topic} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(topic)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), topic])
                                        : field.onChange(field.value?.filter((value) => value !== topic))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{topic}</FormLabel>
                              </FormItem>
                           )}/>
                        ))}
                     </div>
                     <FormMessage />
                  </FormItem>
                )}/>

            </AccordionContent>
          </AccordionItem>
          
          {/* Section 3: Additional Information */}
           <AccordionItem value="item-3" className="border rounded-xl shadow-sm bg-card overflow-hidden">
             <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                 <div className="bg-primary/10 text-primary p-2 rounded-lg"><HeartPulse className="h-6 w-6" /></div>
                3. Additional Support Info (Optional)
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-8">
               <FormField control={form.control} name="urgencyLevel" render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-base">How urgent is this request?</FormLabel>
                     <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <Label className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary">
                          <RadioGroupItem value="Routine" />
                          <span className="font-semibold">Routine</span>
                          <span className="text-sm text-muted-foreground">I can wait for the next available slot.</span>
                        </Label>
                        <Label className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary">
                          <RadioGroupItem value="Moderate" />
                          <span className="font-semibold">Moderate</span>
                          <span className="text-sm text-muted-foreground">I would like to be seen soon.</span>
                        </Label>
                        <Label className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary">
                          <RadioGroupItem value="Urgent" />
                          <span className="font-semibold">Urgent</span>
                          <span className="text-sm text-muted-foreground">I need to speak with someone as soon as possible.</span>
                        </Label>
                     </RadioGroup>
                  </FormItem>
               )}/>
               <FormField control={form.control} name="moodRating" render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-base">How are you feeling today?</FormLabel>
                     <div className="flex items-center gap-4 pt-2">
                        <span className="text-4xl">{moodEmojis[mood - 1]}</span>
                        <FormControl>
                          <Slider
                            min={1} max={5} step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="flex-1"
                          />
                        </FormControl>
                     </div>
                  </FormItem>
               )}/>
               <FormField control={form.control} name="hasEmergencyContact" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                     <div className="space-y-0.5">
                       <FormLabel className="text-base">Do you want to add an emergency contact?</FormLabel>
                       <FormDescription>This is optional, but recommended for urgent situations.</FormDescription>
                     </div>
                     <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
               )}/>
                {hasEmergencyContact && (
                   <Card className="bg-muted/50 p-6 space-y-4">
                      <FormField control={form.control} name="emergencyContactInfo.name" render={({ field }) => (<FormItem><FormLabel>Contact's Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emergencyContactInfo.relationship" render={({ field }) => (<FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emergencyContactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </Card>
                )}

            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || authLoading || !!counselorError}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit Request'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
