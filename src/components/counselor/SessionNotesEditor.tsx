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
import { Textarea } from '@/components/ui/textarea';
import { SessionNotesSchema, type SessionNotesInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { handleSummarizeSessionNotes, handleSummarizeCallTranscript } from '@/lib/actions';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Save, Loader2, FileText } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '../ui/skeleton';

interface SessionNotesEditorProps {
  sessionId: string;
  studentName?: string;
  initialNotes?: string;
}

export function SessionNotesEditor({ sessionId, studentName, initialNotes = '' }: SessionNotesEditorProps) {
  const { toast } = useToast();
  // State for session notes
  const [notesSummary, setNotesSummary] = useState<string | null>(null);
  const [isNotesSummarizing, setIsNotesSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for transcript
  const [transcript, setTranscript] = useState('');
  const [transcriptSummary, setTranscriptSummary] = useState<string | null>(null);
  const [isTranscriptSummarizing, setIsTranscriptSummarizing] = useState(false);

  const form = useForm<SessionNotesInput>({
    resolver: zodResolver(SessionNotesSchema),
    defaultValues: {
      sessionId: sessionId,
      notes: initialNotes,
      topicsDiscussed: [],
      actionItems: [],
    },
  });

  async function onSummarizeNotes() {
    const notes = form.getValues('notes');
    if (notes.length < 20) {
      toast({
        variant: 'destructive',
        title: 'Notes too short',
        description: 'Please write at least 20 characters to generate a summary.',
      });
      return;
    }

    setIsNotesSummarizing(true);
    setNotesSummary(null);
    const result = await handleSummarizeSessionNotes({ sessionNotes: notes });
    if (result.summary) {
      setNotesSummary(result.summary);
      toast({
        title: 'Summary Generated',
        description: 'AI-powered summary has been created for your notes.',
      });
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Error',
        description: result.error,
      });
    }
    setIsNotesSummarizing(false);
  }
  
  async function onSummarizeTranscript() {
    if (transcript.length < 50) {
      toast({
        variant: 'destructive',
        title: 'Transcript too short',
        description: 'Please provide at least 50 characters of transcript text to generate a summary.',
      });
      return;
    }
    
    setIsTranscriptSummarizing(true);
    setTranscriptSummary(null);
    const result = await handleSummarizeCallTranscript({ transcript });
    if (result.summary) {
      setTranscriptSummary(result.summary);
      toast({
        title: 'Transcript Summary Generated',
        description: 'AI-powered summary of the transcript has been created.',
      });
    } else if (result.error) {
       toast({
        variant: 'destructive',
        title: 'Summarization Error',
        description: result.error,
      });
    }
    setIsTranscriptSummarizing(false);
  }

  async function onSubmit(values: SessionNotesInput) {
    setIsSaving(true);
    // Simulate API call to save notes
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving notes:', values);
    toast({
      title: 'Session Notes Saved',
      description: `Notes for session ${values.sessionId} have been securely saved.`,
    });
    setIsSaving(false);
  }

  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 md:w-1/2">
        <TabsTrigger value="notes">Session Notes</TabsTrigger>
        <TabsTrigger value="transcript">Transcript Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="notes">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Session Notes Editor
              </CardTitle>
              <CardDescription>
                Record key discussion points for {studentName ? ` ${studentName}` : ` session ${sessionId}`}.
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
                </CardContent>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-end border-t pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSummarizeNotes}
                    disabled={isNotesSummarizing || form.getValues('notes').length < 20}
                    className="w-full sm:w-auto"
                  >
                    {isNotesSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Notes Summary
                  </Button>
                  <Button type="submit" disabled={isSaving || !form.formState.isValid} className="w-full sm:w-auto">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Notes
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>

          <Card className="md:col-span-1 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Wand2 className="text-primary" /> AI Summary (Notes)
              </CardTitle>
              <CardDescription>A concise overview of your written notes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isNotesSummarizing && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
              {!isNotesSummarizing && notesSummary && (
                <ScrollArea className="h-[300px] p-1">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{notesSummary}</p>
                </ScrollArea>
              )}
              {!isNotesSummarizing && !notesSummary && (
                <p className="text-muted-foreground text-sm text-center py-10">
                  Click &quot;Generate Notes Summary&quot; to see the result here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="transcript">
        <div className="grid md:grid-cols-3 gap-6">
           <Card className="md:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Transcript Summarizer</CardTitle>
              <CardDescription>
                Paste the full call transcript below to generate an AI summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Textarea
                placeholder="Paste the full call transcript here..."
                className="min-h-[300px] resize-y text-base leading-relaxed"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
               <Button
                type="button"
                onClick={onSummarizeTranscript}
                disabled={isTranscriptSummarizing || transcript.length < 50}
                className="w-full"
              >
                {isTranscriptSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Summary from Transcript
              </Button>
            </CardContent>
          </Card>
          
           <Card className="md:col-span-1 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <FileText className="text-primary"/> AI Summary (Transcript)
              </CardTitle>
              <CardDescription>A concise overview of the call transcript.</CardDescription>
            </CardHeader>
            <CardContent>
              {isTranscriptSummarizing && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              )}
              {!isTranscriptSummarizing && transcriptSummary && (
                <ScrollArea className="h-[300px] p-1">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{transcriptSummary}</p>
                </ScrollArea>
              )}
              {!isTranscriptSummarizing && !transcriptSummary && (
                <p className="text-muted-foreground text-sm text-center py-10">
                  Paste a transcript and click &quot;Generate Summary&quot; to see the result here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
