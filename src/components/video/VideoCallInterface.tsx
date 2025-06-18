
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Mic, PhoneOff, ScreenShare, MessageSquare, Users, Maximize, Minimize, VideoOff, MicOff, AlertTriangle, UserCircle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area'; // Added import
import { Input } from '../ui/input'; // Added import
import { XCircle } from 'lucide-react'; // Added for chat close

// Placeholder for participant data - simplified for this example
interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  avatarFallback: string;
  isRemoteVideoOff?: boolean; // For remote participant's video status (simulated)
}

const localUserPlaceholder: Participant = {
  id: 'localUser',
  name: 'You (Student/Counselor)',
  isLocal: true,
  avatarFallback: 'U',
};

const remoteParticipantPlaceholder: Participant = {
  id: 'remoteUser',
  name: 'Participant Name', // This would be dynamic
  isLocal: false,
  avatarFallback: 'P',
  isRemoteVideoOff: false, // Simulate remote video is on by default
};

export function VideoCallInterface() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isLocalVideoOff, setIsLocalVideoOff] = useState(false);
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function setupLocalMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setPermissionsError(null);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        let message = "An unknown error occurred while accessing media devices.";
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            message = "Camera and microphone access denied. Please enable permissions in your browser settings and refresh the page.";
          } else {
            message = `Error accessing media devices: ${err.message}. Check console for details.`;
          }
        }
        setPermissionsError(message);
      }
    }
    setupLocalMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoOff(prev => !prev);
    }
  };
  
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing); // Placeholder
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && !isFullScreen) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true)).catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    } else if (document.exitFullscreen && isFullScreen) {
      document.exitFullscreen().then(() => setIsFullScreen(false)).catch(err => console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`));
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  const RemoteParticipantView = () => (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-inner w-full h-full">
      {remoteParticipantPlaceholder.isRemoteVideoOff ? (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/10">
          <Avatar className="w-24 h-24 text-4xl mb-2">
            <AvatarFallback>{remoteParticipantPlaceholder.avatarFallback}</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground">{remoteParticipantPlaceholder.name}</p>
          <VideoOff className="w-8 h-8 text-destructive mt-1" strokeWidth={1.5} />
        </div>
      ) : (
        <Image src={`https://placehold.co/1280x720.png`} alt={`${remoteParticipantPlaceholder.name}'s video`} layout="fill" objectFit="cover" data-ai-hint="person webcam call" />
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
        {remoteParticipantPlaceholder.name}
        {/* Simulate remote mute icon if needed: <MicOff className="inline w-3 h-3 text-yellow-400 ml-1" /> */}
      </div>
    </div>
  );

  const LocalParticipantView = () => (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-md w-full h-full">
      {isLocalVideoOff || !localStream ? (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/10">
          <Avatar className="w-16 h-16 text-2xl mb-1">
            <AvatarFallback>{localUserPlaceholder.avatarFallback}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">{localUserPlaceholder.name}</p>
          {!localStream && permissionsError ? null : <VideoOff className="w-5 h-5 text-destructive mt-0.5" strokeWidth={1.5} />}
        </div>
      ) : (
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      )}
       <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
        {localUserPlaceholder.name} {isMicMuted && <MicOff className="inline w-3 h-3 text-yellow-400 ml-1" />}
      </div>
    </div>
  );

  return (
    <Card className={`w-full mx-auto shadow-2xl flex flex-col ${isFullScreen ? 'fixed inset-0 z-[100] rounded-none border-0' : 'max-w-5xl h-[calc(100vh-100px)] max-h-[800px]'}`}>
      <CardHeader className="flex flex-row items-center justify-between bg-card-foreground text-primary-foreground p-3 border-b">
        <CardTitle className="text-lg font-semibold">Secure Video Session</CardTitle>
        <div className="text-sm font-mono bg-black/30 px-2 py-1 rounded">{formatDuration(callDuration)}</div>
      </CardHeader>

      <CardContent className="flex-1 p-1 md:p-2 grid grid-rows-[1fr_auto] gap-2 overflow-auto bg-background/50 relative">
        {permissionsError && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 p-4">
            <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive-foreground text-center font-semibold mb-2">Media Permissions Error</p>
            <p className="text-muted-foreground text-center text-sm">{permissionsError}</p>
          </div>
        )}
        
        <div className="relative w-full h-full min-h-[200px]"> {/* Main video area */}
          {isScreenSharing ? (
            <div className="w-full h-full border-2 border-primary rounded-lg p-4 bg-muted flex flex-col items-center justify-center">
                <ScreenShare size={64} className="text-primary/50 mb-4" />
                <p className="text-center text-primary font-semibold">You are presenting your screen.</p>
                <p className="text-xs text-muted-foreground mt-1">(This is a placeholder for actual screen content)</p>
            </div>
          ) : (
             <RemoteParticipantView />
          )}
        </div>
        
        {/* Local Participant's Video (PIP style) */}
        <div className={`absolute bottom-2 right-2 w-[120px] h-auto sm:w-[160px] md:w-[200px] z-10 transition-opacity duration-300 ${isScreenSharing ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
            <LocalParticipantView />
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
            <Button variant={isMicMuted ? "destructive" : "outline"} size="icon" onClick={toggleMute} aria-label={isMicMuted ? "Unmute Microphone" : "Mute Microphone"} disabled={!localStream || !!permissionsError}>
            {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button variant={isLocalVideoOff ? "destructive" : "outline"} size="icon" onClick={toggleVideo} aria-label={isLocalVideoOff ? "Start Video" : "Stop Video"} disabled={!localStream || !!permissionsError}>
            {isLocalVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button variant={isScreenSharing ? "secondary" : "outline"} size="icon" onClick={toggleScreenShare} aria-label={isScreenSharing ? "Stop Sharing Screen" : "Share Screen"} disabled={!!permissionsError}>
            <ScreenShare className="h-5 w-5" />
            </Button>
        </div>
        <Button variant="destructive" size="lg" className="px-4 sm:px-6 font-semibold my-2 sm:my-0 order-first sm:order-none" onClick={() => alert('Call Ended (Simulated)')}>
          <PhoneOff className="h-5 w-5 mr-2" /> End Call
        </Button>
        <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="icon" onClick={toggleChat} aria-label="Toggle Chat Panel">
            <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" disabled aria-label="View Participants">
            <Users className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullScreen} aria-label={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}>
             {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
        </div>
      </CardFooter>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className={`absolute top-0 right-0 h-full w-full sm:w-72 md:w-80 bg-card shadow-xl border-l transform transition-transform duration-300 ease-in-out p-0 flex flex-col z-30 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-3 border-b flex justify-between items-center bg-card-foreground text-primary-foreground">
                <h4 className="font-semibold text-md">Session Chat</h4>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="text-primary-foreground hover:bg-white/20">
                    <XCircle className="h-5 w-5" />
                    <span className="sr-only">Close chat</span>
                </Button>
            </div>
            <ScrollArea className="flex-1 p-3 space-y-3 bg-background/70">
                {/* Example Chat Messages */}
                <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback><UserCircle size={18}/></AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary p-2.5 rounded-lg rounded-tl-none shadow">
                        <p className="text-xs font-semibold text-secondary-foreground">John Mensah</p>
                        <p className="text-sm text-secondary-foreground">Hello! Just wanted to check in.</p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5 text-right">10:30 AM</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-2 justify-end">
                     <div className="bg-primary p-2.5 rounded-lg rounded-tr-none shadow">
                        <p className="text-xs font-semibold text-primary-foreground text-right">You</p>
                        <p className="text-sm text-primary-foreground">Hi John, thanks for reaching out!</p>
                        <p className="text-xs text-primary-foreground/80 mt-0.5 text-right">10:31 AM</p>
                    </div>
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">{localUserPlaceholder.avatarFallback}</AvatarFallback>
                    </Avatar>
                </div>
                 <p className="text-xs text-muted-foreground text-center py-2">Chat functionality is a placeholder.</p>
            </ScrollArea>
            <div className="p-3 border-t bg-card">
                <Input placeholder="Type a message..." disabled />
            </div>
        </div>
      )}
    </Card>
  );
}

