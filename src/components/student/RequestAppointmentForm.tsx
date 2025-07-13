
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2, Video, MessageCircle, Users, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequestAppointmentSchema, type RequestAppointmentInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createAppointment, getCounselors } from '@/lib/actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';

const availableTimes = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00",
];

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
} : React.ComponentProps<typeof DayPicker>) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
       components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"


export function RequestAppointmentForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [counselors, setCounselors] = useState<User[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);

  useEffect(() => {
    async function fetchCounselors() {
      setLoadingCounselors(true);
      const result = await getCounselors();
      if (result.data) {
        setCounselors(result.data);
      } else if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the list of counselors.',
        });
      }
      setLoadingCounselors(false);
    }
    fetchCounselors();
  }, [toast]);

  const form = useForm<RequestAppointmentInput>({
    resolver: zodResolver(RequestAppointmentSchema),
    defaultValues: {
      reason: '',
      contactMethod: 'video',
      counselorId: '',
      preferredTime: '',
    },
  });

  async function onSubmit(values: RequestAppointmentInput) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Authenticated', description: 'You must be logged in to book an appointment.' });
        return;
    }
    const result = await createAppointment(user.uid, values);

    if (result.success) {
      toast({
        title: 'Request Sent!',
        description: 'Your appointment request has been submitted. You will be notified once it is confirmed.',
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error,
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-8 space-y-8">
            {/* Counselor Selection */}
            <FormField
              control={form.control}
              name="counselorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Select a Counselor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCounselors}>
                    <FormControl>
                      <SelectTrigger>
                        {loadingCounselors ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        <SelectValue placeholder="Choose a professional to speak with" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {counselors.map((c) => (
                        <SelectItem key={c.uid} value={c.uid}>{c.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>You can choose any available counselor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg font-semibold">Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0)) 
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                     <FormDescription>Choose a date that works for you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-lg font-semibold">Preferred Time</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                        </SelectContent>
                     </Select>
                      <FormDescription>All times are in your local timezone.</FormDescription>
                     <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Reason for visit */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly tell us what you'd like to discuss. This helps the counselor prepare for your session."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>This information is confidential.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Method */}
             <FormField
                control={form.control}
                name="contactMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-semibold">How would you like to meet?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <FormItem>
                          <label className="flex flex-col items-center justify-center p-4 cursor-pointer border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <FormControl>
                              <RadioGroupItem value="video" className="sr-only" />
                            </FormControl>
                            <Video className="h-8 w-8 mb-2 text-primary"/>
                            <span className="font-semibold">Video Call</span>
                          </label>
                        </FormItem>
                        <FormItem>
                           <label className="flex flex-col items-center justify-center p-4 cursor-pointer border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <FormControl>
                              <RadioGroupItem value="chat" className="sr-only"/>
                            </FormControl>
                            <MessageCircle className="h-8 w-8 mb-2 text-primary"/>
                            <span className="font-semibold">Chat</span>
                          </label>
                        </FormItem>
                         <FormItem>
                           <label className="flex flex-col items-center justify-center p-4 cursor-pointer border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <FormControl>
                              <RadioGroupItem value="in-person" className="sr-only" />
                            </FormControl>
                            <Users className="h-8 w-8 mb-2 text-primary"/>
                            <span className="font-semibold">In-Person</span>
                          </label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-8 py-4">
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Submit Request
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    