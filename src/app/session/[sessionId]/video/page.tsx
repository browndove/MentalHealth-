import { VideoCallInterface } from "@/components/video/VideoCallInterface";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function VideoSessionPage({ params }: { params: { sessionId: string } }) {
  // const { sessionId } = params; // Use sessionId to fetch session details if needed

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-4xl mb-2 flex justify-start">
        <Button variant="outline" asChild size="sm">
          <Link href="/student/dashboard"> {/* Or counselor dashboard */}
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <VideoCallInterface />
    </div>
  );
}
// This page will not be part of student/counselor layouts to allow for full screen video.
// A separate, minimal layout could be made for it if global elements are needed.
