
'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Video, Mic, PhoneOff, ScreenShare, MessageSquare, User, MoreHorizontal, ChevronDown, Copy,
  Settings2, Volume2, Maximize, VideoOff, MicOff, Users, Info, MessageCircle, Hand, ListVideo, SmilePlus, AlertTriangle
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { AppLogo } from '../layout/AppLogo'; // Using AppLogo for branding
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarFallback: string;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
}

const mockParticipants: Participant[] = [
  { id: 'local', name: 'You (Counselor)', avatarFallback: 'U', isLocal: true, isMuted: false, isVideoOff: false },
  { id: 'remote1', name: 'Akwasi Mensah (Student)', avatarFallback: 'AM', avatarUrl: 'https://placehold.co/200x200.png?text=Student', isMuted: true, isVideoOff: false, isSpeaking: true },
  { id: 'remote2', name: 'Dr. Emily Carter (Observer)', avatarFallback: 'EC', avatarUrl: 'https://placehold.co/200x200.png?text=Observer', isMuted: false, isVideoOff: true },
];

const mockTranscript = [
    { id: 't1', name: 'Akwasi Mensah', time: '10:15 AM', text: "Good morning, counselor. Thanks for meeting with me. I've been feeling quite overwhelmed with my coursework lately." },
    { id: 't2', name: 'You (Counselor)', time: '10:16 AM', text: "Good morning, Akwasi. I'm here to help. Can you tell me a bit more about what's been feeling overwhelming?" },
    { id: 't3', name: 'Akwasi Mensah', time: '10:17 AM', text: "It's mainly the volume of assignments and the upcoming exams. I feel like I can't keep up, and it's affecting my sleep." },
    { id: 't4', name: 'You (Counselor)', time: '10:18 AM', text: "That sounds really tough. It's common for students to feel this way. Let's explore some strategies to manage this workload and stress." },
];


export function VideoCallInterface() {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true); // Transcript panel is open by default as in image
  const [currentDate] = useState(new Date());

  // Local media states
  const [isLocalMicMuted, setIsLocalMicMuted] = useState(false);
  const [isLocalVideoOff, setIsLocalVideoOff] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
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
      localStream?.getTracks().forEach(track => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const toggleLocalMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsLocalMicMuted(prev => !prev);
      setParticipants(prev => prev.map(p => p.isLocal ? {...p, isMuted: !p.isMuted} : p));
    }
  };

  const toggleLocalVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoOff(prev => !prev);
       setParticipants(prev => prev.map(p => p.isLocal ? {...p, isVideoOff: !p.isVideoOff} : p));
    }
  };

  const handleLeaveCall = () => {
    alert("Leave Call clicked (functionality not implemented). In a real app, this would disconnect from the session.");
    localStream?.getTracks().forEach(track => track.stop());
    // Add navigation logic here, e.g., router.push('/dashboard')
  };

  const ParticipantVideo = ({ participant }: { participant: Participant }) => {
    const isLocalAndNoPermission = participant.isLocal && hasCameraPermission === false;
    const showVideo = participant.isLocal ? localStream && !isLocalVideoOff && hasCameraPermission : !participant.isVideoOff;

    return (
      <div className={cn(
        "relative aspect-video bg-zinc-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center group",
        participant.isSpeaking && !participant.isLocal && "ring-2 ring-blue-500"
      )}>
        {showVideo && !isLocalAndNoPermission ? (
          participant.isLocal && localStream ? (
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <Image src={participant.avatarUrl || `https://placehold.co/300x225.png`} data-ai-hint="person webcam image" alt={`${participant.name}'s video`} layout="fill" objectFit="cover" />
          )
        ) : (
          <div className="flex flex-col items-center text-neutral-400">
            <Avatar className="w-16 h-16 text-2xl mb-2">
              <AvatarImage src={participant.avatarUrl} alt={participant.name} />
              <AvatarFallback>{participant.avatarFallback}</AvatarFallback>
            </Avatar>
            {isLocalAndNoPermission ? <AlertTriangle className="w-6 h-6 text-destructive mt-1" /> : <VideoOff className="w-6 h-6 mt-1" />}
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1.5">
          {participant.isMuted ? <MicOff size={12} className="text-yellow-400" /> : <Mic size={12} />}
          {participant.name}
        </div>
      </div>
    );
  };
  
  const controlButtonClass = "bg-zinc-700 hover:bg-zinc-600 text-neutral-200 rounded-lg p-2.5 h-auto aspect-square flex flex-col items-center justify-center text-xs gap-1";
  const destructiveButtonClass = "bg-red-600 hover:bg-red-700 text-white rounded-lg p-2.5 h-auto aspect-square flex flex-col items-center justify-center text-xs gap-1";


  return (
    <TooltipProvider>
    <div className="h-screen w-screen flex flex-col bg-zinc-900 text-neutral-100 antialiased overflow-hidden">
      {/* Top Header */}
      <header className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-700 shrink-0">
        <div className="flex items-center gap-3">
          <AppLogo /> {/* Using Mental Guide logo */}
          <div className="h-6 w-px bg-zinc-700"></div>
          <div>
            <h1 className="text-md font-semibold">Counseling Session</h1>
            <p className="text-xs text-neutral-400">
              {currentDate.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })} • {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
           <div className="flex items-center gap-2 text-neutral-300">
             <Users size={16} />
             <span>{participants.length} Participants</span>
             <ChevronDown size={16} className="text-neutral-500" />
           </div>
           <div className="h-6 w-px bg-zinc-700"></div>
           <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-neutral-300 text-xs h-8">
             meet.mentalguide.app/session-link
             <Copy size={14} className="ml-2 text-neutral-400" />
           </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-fr overflow-y-auto">
          {participants.map(p => <ParticipantVideo key={p.id} participant={p} />)}
           {hasCameraPermission === false && (
            <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-zinc-800 rounded-lg">
              <AlertTriangle className="w-12 h-12 text-destructive mb-3" />
              <h3 className="text-lg font-semibold text-neutral-100">Camera & Microphone Access Required</h3>
              <p className="text-neutral-400 text-sm">
                Mental Guide needs access to your camera and microphone for video calls. 
                Please enable these permissions in your browser settings and refresh the page.
              </p>
            </div>
          )}
        </div>

        {/* Transcript Panel */}
        {isChatPanelOpen && (
          <aside className="w-[340px] bg-white text-zinc-900 flex flex-col border-l border-zinc-700 shrink-0">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="font-semibold text-md">Transcript</h2>
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-800" onClick={() => setIsChatPanelOpen(false)}>
                <Info size={18} />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {mockTranscript.map(entry => (
                <div key={entry.id}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-semibold text-zinc-700">{entry.name}</span>
                    <span className="text-xs text-zinc-400">{entry.time}</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">{entry.text}</p>
                </div>
              ))}
            </ScrollArea>
             <div className="p-3 border-t border-zinc-200">
                <p className="text-xs text-zinc-500 text-center">AI summary will be available after the call. (Demo)</p>
            </div>
          </aside>
        )}
      </main>

      {/* Bottom Control Bar */}
      <footer className="px-4 py-2.5 bg-zinc-900 border-t border-zinc-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <Volume2 size={20}/> <span>Record</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Start Recording (Disabled)</p></TooltipContent>
            </Tooltip>
        </div>
        <div className="flex items-center gap-2.5">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className={cn(controlButtonClass, isLocalMicMuted && "bg-red-600 hover:bg-red-700 text-white")}
                        onClick={toggleLocalMute}
                        disabled={hasCameraPermission === false}
                    >
                        {isLocalMicMuted ? <MicOff size={20}/> : <Mic size={20}/>} 
                        <span>{isLocalMicMuted ? 'Unmute' : 'Mute'}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isLocalMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className={cn(controlButtonClass, isLocalVideoOff && "bg-red-600 hover:bg-red-700 text-white")}
                        onClick={toggleLocalVideo}
                        disabled={hasCameraPermission === false}
                    >
                         {isLocalVideoOff ? <VideoOff size={20}/> : <Video size={20}/>} 
                        <span>{isLocalVideoOff ? 'Start Cam': 'Stop Cam'}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isLocalVideoOff ? 'Start Camera': 'Stop Camera'}</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <ScreenShare size={20}/> <span>Share</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Share Screen (Disabled)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={destructiveButtonClass} onClick={handleLeaveCall}>
                        <PhoneOff size={20}/> <span>Leave</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Leave Call</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} onClick={() => setIsChatPanelOpen(prev => !prev)}>
                        <MessageCircle size={20}/> <span>Chat</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isChatPanelOpen ? 'Hide' : 'Show'} Transcript</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <SmilePlus size={20}/> <span>Sticker</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Stickers (Disabled)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <MoreHorizontal size={20}/> <span>More</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>More Options (Disabled)</p></TooltipContent>
            </Tooltip>
        </div>
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <Hand size={20}/> <span>Raise</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Raise Hand (Disabled)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <ListVideo size={20}/> <span>Captions</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Toggle Captions (Disabled)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={controlButtonClass} disabled>
                        <Info size={20}/> <span>Detail</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Session Details (Disabled)</p></TooltipContent>
            </Tooltip>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}
