
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, FileText, Youtube, Headphones, ShieldCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    id: "res1",
    title: "Understanding and Managing Anxiety",
    type: "Article",
    Icon: FileText,
    description: "An in-depth article on recognizing anxiety symptoms and practical coping strategies. Published by the National Institute of Mental Health.",
    link: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "open book calm",
    category: "Anxiety",
    tags: ["anxiety", "coping", "mental health", "article"],
  },
  {
    id: "res2",
    title: "Guided Meditation for Stress Relief (10 min)",
    type: "Audio",
    Icon: Headphones,
    description: "A short guided audio meditation designed to help reduce stress and promote relaxation. Suitable for beginners.",
    link: "https://www.youtube.com/watch?v=O-6f5wQXSu8", // Example link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "headphones nature",
    category: "Stress Management",
    tags: ["meditation", "stress", "audio", "mindfulness"],
  },
  {
    id: "res3",
    title: "Effective Study Habits for Academic Success",
    type: "Video",
    Icon: Youtube,
    description: "A video guide by a university learning specialist on developing effective study techniques and time management skills.",
    link: "https://www.youtube.com/watch?v=p_c99xV2k2Y", // Example link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "student studying video",
    category: "Academic Support",
    tags: ["study skills", "video", "time management", "academic"],
  },
  {
    id: "res4",
    title: "Building Healthy Sleep Habits",
    type: "Article",
    Icon: FileText,
    description: "Learn about the importance of sleep for mental and physical health, and get tips for improving your sleep hygiene.",
    link: "https://www.sleepfoundation.org/sleep-hygiene",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "moon stars sleep",
    category: "Well-being",
    tags: ["sleep", "health", "article", "wellbeing"],
  },
  {
    id: "res5",
    title: "Crisis Hotlines and Emergency Contacts",
    type: "Tool",
    Icon: ShieldCheck,
    description: "A list of important phone numbers and resources for immediate mental health support and crisis situations.",
    link: "/student/resources/emergency-contacts", // Placeholder for an internal page or direct links
    image: "https://placehold.co/600x400.png",
    dataAiHint: "emergency phone",
    category: "Crisis Support",
    tags: ["emergency", "hotline", "support", "crisis"],
  },
  {
    id: "res6",
    title: "Interactive Mood Tracker App",
    type: "Tool",
    Icon: ExternalLink, // Assuming it's an external tool
    description: "An example link to an external mood tracking application to help you understand your emotional patterns.",
    link: "https://www.daylio.net/", // Example link to an actual app
    image: "https://placehold.co/600x400.png",
    dataAiHint: "mobile app chart",
    category: "Tools",
    tags: ["mood tracker", "app", "tool", "self-help"],
  },
];

export default function ResourcesPage() {
  // Add search/filter state and logic here in a real app
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.tags && resource.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Mental Health Resources</h1>
        </div>
        <div className="relative w-full md:w-auto max-w-sm">
          <Input 
            type="search" 
            placeholder="Search resources by title, keyword..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        Explore a curated collection of articles, videos, tools, and other resources to support your mental well-being.
      </p>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-48 w-full">
                <Image src={resource.image} alt={resource.title} layout="fill" objectFit="cover" data-ai-hint={resource.dataAiHint} />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <resource.Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">{resource.type} - {resource.category}</span>
                </div>
                <CardTitle className="text-xl font-headline group-hover:text-accent transition-colors">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={resource.type === "Tool" && resource.id === "res5" ? "secondary" : "default"}>
                  <Link href={resource.link} target={resource.link.startsWith('http') ? '_blank' : '_self'} rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                    {resource.link.startsWith('http') ? <ExternalLink className="mr-2 h-4 w-4" /> : <resource.Icon className="mr-2 h-4 w-4" />}
                    {resource.type === "Tool" && resource.id === "res5" ? "View Contacts" : resource.link.startsWith('http') ? "Visit Resource" : "Access Resource"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Image src="https://placehold.co/300x200.png" alt="No results" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="magnifying glass empty" />
            <p className="text-muted-foreground">No resources found matching your search criteria. Try a different term.</p>
          </CardContent>
        </Card>
      )}
       
      {/* Basic pagination idea - could be improved */}
      {resources.length > 6 && searchTerm === "" && (
        <div className="text-center mt-8">
            <Button variant="outline">Load More Resources</Button>
        </div>
      )}
    </div>
  );
}

