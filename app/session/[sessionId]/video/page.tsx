
import { VideoCallInterface } from "@/components/video/VideoCallInterface";
// No Back to Dashboard button needed as the new UI is full-screen

export default function VideoSessionPage({ params }: { params: { sessionId: string } }) {
  // const { sessionId } = params; // Use sessionId to fetch session details if needed

  return (
    // The VideoCallInterface will handle its own full-screen dark background
    <VideoCallInterface />
  );
}
// This page will not be part of student/counselor layouts to allow for full screen video.
