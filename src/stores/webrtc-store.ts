
import { create } from 'zustand';
import type Peer from 'simple-peer';

export type CallStatus = 
  | 'idle' 
  | 'requesting' 
  | 'connecting' 
  | 'connected' 
  | 'disconnected' 
  | 'error';

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peer: Peer.Instance | null;
  status: CallStatus;
  isLocalMicMuted: boolean;
  isLocalVideoOff: boolean;
  error: string | null;

  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setPeer: (peer: Peer.Instance | null) => void;
  setStatus: (status: CallStatus) => void;
  setError: (error: string | null) => void;

  toggleLocalMic: () => void;
  toggleLocalVideo: () => void;
  
  reset: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  localStream: null,
  remoteStream: null,
  peer: null,
  status: 'idle',
  isLocalMicMuted: false,
  isLocalVideoOff: false,
  error: null,

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setPeer: (peer) => set({ peer }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),

  toggleLocalMic: () => {
    const { localStream, isLocalMicMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      set({ isLocalMicMuted: !isLocalMicMuted });
    }
  },
  toggleLocalVideo: () => {
    const { localStream, isLocalVideoOff } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      set({ isLocalVideoOff: !isLocalVideoOff });
    }
  },
  
  reset: () => {
    const { localStream, peer } = get();
    localStream?.getTracks().forEach(track => track.stop());
    peer?.destroy();
    set({
      localStream: null,
      remoteStream: null,
      peer: null,
      status: 'idle',
      isLocalMicMuted: false,
      isLocalVideoOff: false,
      error: null,
    });
  },
}));
