import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, FileText, Youtube, Headphones } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    id: "1",
    title: "Understanding Anxiety",
    type: "Article",
    Icon: FileText,
    description: "Learn about the common signs, symptoms, and types of anxiety.",
    link: "#",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "reading book"
  },
  {
    id: "2",
    title: "Guided Meditation for Stress Relief",
    type: "Audio",
    Icon: Headphones,
    description: "A 10-minute guided meditation to help you relax and de-stress.",
    link: "#",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "meditation nature"
  },
  {
    id: "3",
    title: "Coping with Academic Pressure",
    type: "Video",
    Icon: Youtube,
    description: "Tips and strategies for managing stress related to studies.",
    link: "#",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "student studying"
  },
  {
    id: "4",
    title: "Building Healthy Habits",
    type: "Article",
    Icon: FileText,
    description: "Explore ways to incorporate healthy habits into your daily routine.",
    link: "#",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "healthy lifestyle"
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline">Mental Health Resources</h1>
        </div>
        <div className="relative w-full md:w-auto max-w-sm">
          <Input type="search" placeholder="Search resources..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        Explore a curated collection of articles, videos, tools, and other resources to support your mental well-being.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <Card key={resource.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image src={resource.image} alt={resource.title} layout="fill" objectFit="cover" data-ai-hint={resource.dataAiHint} />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <resource.Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">{resource.type}</span>
              </div>
              <CardTitle className="text-xl font-headline">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{resource.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={resource.link}>Access Resource</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="text-center mt-8">
        <Button variant="outline">Load More Resources</Button>
      </div>
    </div>
  );
}
