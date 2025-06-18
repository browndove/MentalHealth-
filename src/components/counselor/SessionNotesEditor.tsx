'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea }from '@/components/ui/textarea';
import { SessionNotesSchema, type SessionNotesInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { handleSummarizeSessionNotes } from '@/lib/actions';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Save, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SessionNotesEditorProps {
  sessionId: string; // Or studentId if notes are per student before a session is formalized
  studentName?: string; // Optional: For context
  initialNotes?: string; // For editing existing notes
}

export function SessionNotesEditor({ sessionId, studentName, initialNotes = '' }: SessionNotesEditorProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SessionNotesInput>({
    resolver: zodResolver(SessionNotesSchema),
    defaultValues: {
      sessionId: sessionId,
      notes: initialNotes,
      topicsDiscussed: [],
      actionItems: [],
    },
  });

  async function onSummarize() {
    const notes = form.getValues('notes');
    if (notes.length < 20) {
      toast({
        variant: 'destructive',
        title: 'Notes too short',
        description: 'Please write at least 20 characters to generate a summary.',
      });
      return;
    }

    setIsSummarizing(true);
    setSummary(null);
    const result = await handleSummarizeSessionNotes({ sessionNotes: notes });
    if (result.summary) {
      setSummary(result.summary);
      toast({
        title: 'Summary Generated',
        description: 'AI-powered summary has been created.',
      });
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Error',
        description: result.error,
      });
    }
    setIsSummarizing(false);
  }

  async function onSubmit(values: SessionNotesInput) {
    setIsSaving(true);
    // Simulate API call to save notes
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving notes:', values);
    console.log('With summary (if generated):', summary);
    toast({
      title: 'Session Notes Saved',
      description: `Notes for session ${values.sessionId} have been securely saved.`,
    });
    setIsSaving(false);
    // Potentially redirect or clear form if needed
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Session Notes {studentName ? `for ${studentName}` : `(Session ID: ${sessionId})`}
          </CardTitle>
          <CardDescription>
            Record key discussion points, observations, and action items for the session.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Detailed Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Start typing your session notes here..."
                        className="min-h-[300px] resize-y text-base leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add fields for topicsDiscussed and actionItems if using structured arrays */}
            </CardContent>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-end border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onSummarize}
                disabled={isSummarizing || form.getValues('notes').length < 20}
                className="w-full sm:w-auto"
              >
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate AI Summary
              </Button>
              <Button type="submit" disabled={isSaving || !form.formState.isValid} className="w-full sm:w-auto">
                 {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Notes
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>

      <Card className="md:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <Wand2 className="text-primary"/> AI Generated Summary
          </CardTitle>
          <CardDescription>A concise overview of the session notes.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSummarizing && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          {!isSummarizing && summary && (
            <ScrollArea className="h-[300px] p-1">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{summary}</p>
            </ScrollArea>
          )}
          {!isSummarizing && !summary && (
            <p className="text-muted-foreground text-sm text-center py-10">
              Click &quot;Generate AI Summary&quot; after writing notes to see the summary here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
