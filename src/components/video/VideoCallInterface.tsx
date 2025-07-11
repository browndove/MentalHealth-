
'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Video, Mic, PhoneOff, ScreenShare, MessageSquare, Copy,
  VideoOff, MicOff, Users, Info, Hand, Settings, Check
} from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppLogo } from '../layout/AppLogo';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useWebRTCStore } from '@/stores/webrtc-store';
import { transcribeAudioChunk } from '@/ai/flows/transcribe-audio-chunk';
import { AudioVisualizer } from './AudioVisualizer';

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string;
  avatarFallback: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
}

interface TranscriptEntry {
  id: string;
  name: string;
  time: string;
  text: string;
}

const mockParticipants: Participant[] = [
  { id: 'remote1', name: 'Akwasi Mensah (Student)', avatarFallback: 'AM', avatarUrl: 'https://placehold.co/800x600.png', dataAiHint: "student webcam happy", isMuted: true, isVideoOff: false, isSpeaking: true },
  { id: 'local', name: 'You (Counselor)', avatarFallback: 'U', isLocal: true, isMuted: false, isVideoOff: false },
  { id: 'remote2', name: 'Dr. Emily Carter (Observer)', avatarFallback: 'EC', avatarUrl: 'https://placehold.co/800x600.png', dataAiHint: "professional woman webcam", isMuted: false, isVideoOff: true },
];

export function VideoCallInterface() {
  const { toast } = useToast();
  const {
    localStream,
    setLocalStream,
    isLocalMicMuted,
    isLocalVideoOff,
    toggleLocalMic,
    toggleLocalVideo,
    reset,
  } = useWebRTCStore();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const result = await transcribeAudioChunk({ audioDataUri: base64Audio });
        if (result.transcription && result.transcription.trim().length > 0) {
          setTranscript(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              name: 'You (Counselor)', 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: result.transcription,
            }
          ]);
        }
      };
    } catch (error) {
      console.error("Transcription error:", error);
      toast({ variant: 'destructive', title: "Transcription Failed", description: "Could not transcribe audio chunk."});
    }
  }, [toast]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        setLocalStream(stream);

        if (stream.getAudioTracks().length > 0 && typeof MediaRecorder !== 'undefined') {
            const options = { mimeType: 'audio/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                 console.warn(`${options.mimeType} is not supported. Transcription may not work.`);
                 return;
            }
            const recorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            recorder.onstop = () => {
                if (audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    handleTranscription(audioBlob);
                    audioChunksRef.current = [];
                }
            };
            
            transcriptionIntervalRef.current = setInterval(() => {
                if(recorder.state === 'recording') {
                    recorder.stop();
                }
                if(recorder.state === 'inactive' && !useWebRTCStore.getState().isLocalMicMuted) {
                    recorder.start();
                }
            }, 5000); 
            
            if(!useWebRTCStore.getState().isLocalMicMuted) {
                recorder.start();
            }
        }

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use video call features.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
      }
      mediaRecorderRef.current?.stop();
      reset();
    };
  }, [setLocalStream, toast, reset, handleTranscription]);
  
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    
    if (mediaRecorderRef.current) {
        if(isLocalMicMuted && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        } else if (!isLocalMicMuted && mediaRecorderRef.current.state === 'inactive') {
            mediaRecorderRef.current.start();
        }
    }

  }, [localStream, isLocalMicMuted]);

  const handleLeaveCall = () => {
    alert("Leave Call clicked (functionality not implemented). In a real app, this would disconnect from the session.");
    reset();
  };
  
  const handleCopyId = () => {
    navigator.clipboard.writeText("SESSION-ID-PLACEHOLDER");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const participants = mockParticipants.map(p => {
    if (p.isLocal) {
        return { ...p, isMuted: isLocalMicMuted, isVideoOff: isLocalVideoOff };
    }
    return p;
  });

  const mainParticipant = participants.find(p => p.isSpeaking) || participants.find(p => !p.isLocal) || participants[0];
  const otherParticipants = participants.filter(p => p.id !== mainParticipant.id);

  const ParticipantVideo = ({ participant, isMain }: { participant: Participant, isMain: boolean }) => {
    const isLocalAndNoPermission = participant.isLocal && hasCameraPermission === false;
    const showVideo = (participant.isLocal && localStream && !isLocalVideoOff && hasCameraPermission) || (!participant.isLocal && !participant.isVideoOff);

    return (
      <div className={cn(
        "relative bg-slate-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center group w-full h-full transition-all duration-300",
        participant.isSpeaking && !participant.isLocal && "animate-speaking-pulse"
      )}>
        {showVideo ? (
          participant.isLocal ? (
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
          ) : (
            <Image src={participant.avatarUrl || `https://placehold.co/800x600.png`} data-ai-hint={participant.dataAiHint} alt={`${participant.name}'s video`} layout="fill" objectFit="cover" />
          )
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <Avatar className={cn("mb-2", isMain ? "w-24 h-24 text-4xl" : "w-16 h-16 text-2xl")}>
              <AvatarImage src={participant.avatarUrl} alt={participant.name} />
              <AvatarFallback>{participant.avatarFallback}</AvatarFallback>
            </Avatar>
            {isLocalAndNoPermission && <AlertTriangle className="w-6 h-6 text-destructive mt-1" />}
            {participant.isVideoOff && <VideoOff className="w-6 h-6 mt-1" />}
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:opacity-0">
          {participant.isMuted ? <MicOff size={14} className="text-yellow-400" /> : <Mic size={14} className={cn(participant.isSpeaking && "text-primary")}/>}
          {participant.name}
        </div>
        {participant.isLocal && localStream && (
          <div className="absolute top-2 left-2">
            <AudioVisualizer stream={localStream} isMuted={isLocalMicMuted} />
          </div>
        )}
      </div>
    );
  };
  
  const controlButtonClass = "bg-slate-700/80 hover:bg-slate-600/90 text-slate-200 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-md transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105";
  const destructiveButtonClass = "bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 ease-in-out transform active:scale-95 hover:scale-105";


  return (
    <TooltipProvider>
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 antialiased overflow-hidden">
      <header className="px-4 py-2 flex items-center justify-between border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <AppLogo />
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <h1 className="text-md font-semibold">Counseling Session</h1>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit' })} • In Progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center gap-2 text-slate-300">
             <Users size={16} />
             <span>{participants.length}</span>
           </div>
           <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 text-xs h-8" onClick={handleCopyId}>
             Session ID
             {isCopied ? <Check size={14} className="ml-2 text-primary" /> : <Copy size={14} className="ml-2 text-slate-400" />}
           </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 gap-4">
            <div className="flex-1 relative">
              { hasCameraPermission === false &&
                <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera and Microphone Access Denied</AlertTitle>
                        <AlertDescription>
                            Accra TechMind needs access to your camera and microphone for video sessions. Please update your browser's site permissions to allow access.
                        </AlertDescription>
                    </Alert>
                </div>
              }
              <ParticipantVideo participant={mainParticipant} isMain={true} />
            </div>
            <div className="h-32 flex gap-4">
                {otherParticipants.map(p => (
                    <div key={p.id} className="w-52 h-full">
                        <ParticipantVideo participant={p} isMain={false} />
                    </div>
                ))}
            </div>
        </div>

        {isChatPanelOpen && (
          <aside className="w-[360px] bg-background text-foreground flex flex-col border-l border-slate-700 shrink-0 transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-lg">Live Transcript</h2>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setIsChatPanelOpen(false)}>
                <Info size={20} />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {transcript.length > 0 ? transcript.map(entry => (
                  <div key={entry.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{entry.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{entry.name}</span>
                        <span className="text-xs text-muted-foreground">{entry.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    <Mic size={24} className="mx-auto mb-2"/>
                    <p>Live transcription will appear here as you speak.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
             <div className="p-3 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">AI summary will be available after the call.</p>
            </div>
          </aside>
        )}
      </main>

      <footer className="px-4 py-3 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between shrink-0 backdrop-blur-sm">
        <div className="w-1/3">
          {/* Placeholder for left-aligned items */}
        </div>
        <div className="w-1/3 flex items-center justify-center gap-3">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className={cn(controlButtonClass, isLocalMicMuted && "bg-red-600/80 hover:bg-red-700 text-white")}
                        onClick={toggleLocalMic}
                    >
                        {isLocalMicMuted ? <MicOff size={24}/> : <Mic size={24} className="animate-mic-pulse" />} 
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isLocalMicMuted ? 'Unmute' : 'Mute'}</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className={cn(controlButtonClass, isLocalVideoOff && "bg-red-600/80 hover:bg-red-700 text-white")}
                        onClick={toggleLocalVideo}
                    >
                         {isLocalVideoOff ? <VideoOff size={24}/> : <Video size={24}/>} 
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isLocalVideoOff ? 'Start Camera': 'Stop Camera'}</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <ScreenShare size={24}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Share Screen (Coming Soon)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={destructiveButtonClass} onClick={handleLeaveCall}>
                        <PhoneOff size={24}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Leave Call</p></TooltipContent>
            </Tooltip>
        </div>
        <div className="w-1/3 flex items-center justify-end gap-3">
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <Hand size={24}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Raise Hand (Coming Soon)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={cn(controlButtonClass, isChatPanelOpen && 'bg-primary/30 text-primary-foreground')} onClick={() => setIsChatPanelOpen(prev => !prev)}>
                        <MessageSquare size={24}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isChatPanelOpen ? 'Hide' : 'Show'} Transcript</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <Settings size={24}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Settings (Coming Soon)</p></TooltipContent>
            </Tooltip>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}
