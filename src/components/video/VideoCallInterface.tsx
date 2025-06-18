'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, Mic, PhoneOff, ScreenShare, MessageSquare, Users, Settings, Maximize, Minimize } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Placeholder for participant data
interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  avatarFallback: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

const localParticipant: Participant = {
  id: 'localUser',
  name: 'You (Counselor/Student)',
  isLocal: true,
  avatarFallback: 'U',
  isMuted: false,
  isVideoOff: false,
};

const remoteParticipant: Participant = {
  id: 'remoteUser',
  name: 'Participant Name', // This would be dynamic
  isLocal: false,
  avatarFallback: 'P',
  isMuted: false,
  isVideoOff: false,
};

export function VideoCallInterface() {
  const [isMuted, setIsMuted] = useState(localParticipant.isMuted);
  const [isVideoOff, setIsVideoOff] = useState(localParticipant.isVideoOff);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleFullScreen = () => {
    // Basic full screen toggle, actual implementation would use browser Fullscreen API
    setIsFullScreen(!isFullScreen); 
    if (!isFullScreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const VideoFeed = ({ participant }: { participant: Participant }) => (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-inner">
      {participant.isVideoOff ? (
        <div className="flex flex-col items-center justify-center h-full bg-foreground/10">
          <Avatar className="w-24 h-24 text-4xl mb-2">
            <AvatarFallback>{participant.avatarFallback}</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground">{participant.name}</p>
          <Video className="w-8 h-8 text-destructive mt-1" strokeWidth={1.5} />
        </div>
      ) : (
        <Image src={`https://placehold.co/600x338.png`} alt={`${participant.name}'s video`} layout="fill" objectFit="cover" data-ai-hint={participant.isLocal ? "self view webcam" : "person webcam"}/>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {participant.name} {participant.isMuted && <Mic className="inline w-3 h-3 text-destructive ml-1" />}
      </div>
    </div>
  );


  return (
    <Card className={`w-full mx-auto shadow-2xl flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'max-w-4xl h-[calc(100vh-150px)] max-h-[800px]'}`}>
      <CardHeader className="flex flex-row items-center justify-between bg-card-foreground text-primary-foreground p-3 border-b">
        <CardTitle className="text-lg font-semibold">Secure Video Session</CardTitle>
        <div className="text-sm font-mono bg-black/30 px-2 py-1 rounded">{formatDuration(callDuration)}</div>
      </CardHeader>

      <CardContent className="flex-1 p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 overflow-auto bg-background/50">
        {/* Remote Participant's Video (Main View) */}
        <div className="md:col-span-2"> {/* Main video larger */}
          <VideoFeed participant={remoteParticipant} />
        </div>
        {/* Local Participant's Video (Picture-in-Picture style or smaller view) */}
        <div className={`md:col-span-2 ${isScreenSharing ? 'hidden' : 'md:absolute md:bottom-6 md:right-6 md:w-1/4 md:max-w-[200px]'}`}>
          <VideoFeed participant={localParticipant} />
        </div>

        {isScreenSharing && (
            <div className="md:col-span-2 border-2 border-primary rounded-lg p-2 bg-muted">
                <p className="text-center text-primary font-semibold">You are sharing your screen.</p>
                {/* Placeholder for actual screen share content */}
                <div className="aspect-video bg-foreground/5 flex items-center justify-center mt-2 rounded">
                    <ScreenShare size={64} className="text-primary/50" />
                </div>
            </div>
        )}
      </CardContent>

      <CardFooter className="p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
            <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            <Mic className="h-5 w-5" />
            </Button>
            <Button variant={isVideoOff ? "destructive" : "outline"} size="icon" onClick={toggleVideo} aria-label={isVideoOff ? "Start Video" : "Stop Video"}>
            <Video className="h-5 w-5" />
            </Button>
            <Button variant={isScreenSharing ? "secondary" : "outline"} size="icon" onClick={toggleScreenShare} aria-label={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
            <ScreenShare className="h-5 w-5" />
            </Button>
        </div>
        <Button variant="destructive" size="lg" className="px-6 font-semibold" onClick={() => alert('Call Ended (Simulated)')}>
          <PhoneOff className="h-5 w-5 mr-2" /> End Call
        </Button>
        <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="icon" onClick={toggleChat} aria-label="Toggle Chat">
            <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" disabled aria-label="Participants">
            <Users className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullScreen} aria-label={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
             {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
        </div>
      </CardFooter>

      {isChatOpen && (
        <div className={`absolute top-0 right-0 h-full w-full sm:w-80 bg-card shadow-lg border-l transform transition-transform p-0 flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-3 border-b flex justify-between items-center">
                <h4 className="font-semibold">Session Chat</h4>
                <Button variant="ghost" size="icon" onClick={toggleChat}><XCircle className="h-5 w-5" /></Button>
            </div>
            <ScrollArea className="flex-1 p-3 space-y-2">
                {/* Chat messages would go here */}
                <p className="text-xs text-muted-foreground p-2 rounded bg-secondary"><strong>Support:</strong> Welcome to the chat!</p>
                <p className="text-xs text-muted-foreground p-2 rounded bg-secondary text-right"><strong>You:</strong> Hello!</p>
            </ScrollArea>
            <div className="p-3 border-t">
                <Input placeholder="Type a message..." />
            </div>
        </div>
      )}
    </Card>
  );
}
