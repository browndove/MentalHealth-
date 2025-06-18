
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, FileText, Youtube, Headphones, ShieldCheck, ExternalLink, Filter, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from '@/lib/utils';

interface Resource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Audio' | 'Tool' | 'Guided Session';
  Icon: React.ElementType;
  description: string;
  link: string;
  image: string;
  dataAiHint: string;
  category: string;
  tags: string[];
}

const resourcesData: Resource[] = [
  {
    id: "res1",
    title: "Managing Exam Stress: Tips for Accra Technical University Students",
    type: "Article",
    Icon: FileText,
    description: "An in-depth article tailored for ATU students, offering practical strategies to cope with academic pressure and exam anxiety. Features insights from Ghanaian counselors.",
    link: "#", 
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Ghanaian student studying calmly library",
    category: "Academic Stress",
    tags: ["anxiety", "coping", "mental health", "article", "ATU", "exam stress"],
  },
  {
    id: "res2",
    title: "Guided Adhan/Azan Meditation for Inner Peace (10 min)",
    type: "Guided Session", // Changed type
    Icon: PlayCircle, // Changed Icon
    description: "A short guided audio meditation incorporating calming Adhan/Azan elements, designed to help reduce stress and promote relaxation in a culturally resonant way.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "serene mosque Ghana audio meditation",
    category: "Mindfulness & Relaxation",
    tags: ["meditation", "stress", "audio", "mindfulness", "Ghanaian culture", "Islamic meditation", "guided session"],
  },
  {
    id: "res3",
    title: "Effective Study Habits for Success at Ghanaian Universities",
    type: "Video",
    Icon: Youtube,
    description: "A video guide by a University of Ghana learning specialist on developing effective study techniques and time management skills relevant to the Ghanaian academic environment.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "University of Ghana student video lecture",
    category: "Academic Support",
    tags: ["study skills", "video", "time management", "academic", "Ghana university"],
  },
  {
    id: "res4",
    title: "Building Healthy Sleep Habits for Peak Performance",
    type: "Article",
    Icon: FileText,
    description: "Learn about the importance of sleep for mental and physical health, with tips for improving sleep hygiene in a tropical climate.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "peaceful night scene Accra moon",
    category: "Well-being",
    tags: ["sleep", "health", "article", "wellbeing", "tropical health"],
  },
  {
    id: "res5",
    title: "Ghana Mental Health Crisis Hotlines & Emergency Contacts",
    type: "Tool",
    Icon: ShieldCheck,
    description: "A vital list of verified phone numbers and resources for immediate mental health support and crisis situations within Ghana.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "emergency support phone Ghana",
    category: "Crisis Support",
    tags: ["emergency", "hotline", "support", "crisis", "Ghana mental health"],
  },
  {
    id: "res6",
    title: "Understanding Depression: Signs and Support in Our Community",
    type: "Article",
    Icon: FileText,
    description: "A culturally sensitive article discussing the signs of depression and how to seek or offer support within the Ghanaian community context.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "support group discussion Ghana",
    category: "Mental Health Conditions",
    tags: ["depression", "community support", "Ghana", "article"],
  },
   {
    id: "res7",
    title: "Mindful Walking at Aburi Botanical Gardens (Audio Guide)",
    type: "Guided Session", // Changed type
    Icon: PlayCircle, // Changed Icon
    description: "An immersive audio guide for a mindful walking experience, designed to be used at Aburi Botanical Gardens or any serene natural space in Ghana.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Aburi Gardens serene path audio",
    category: "Mindfulness & Relaxation",
    tags: ["mindfulness", "audio", "nature therapy", "Aburi", "Ghana", "guided session"],
  },
  {
    id: "res8",
    title: "Balancing Studies and Social Life at University in Ghana",
    type: "Video",
    Icon: Youtube,
    description: "Ghanaian student vloggers share tips and experiences on managing academic workload while maintaining a healthy social life at university.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Ghanaian students socializing campus life",
    category: "Student Life",
    tags: ["student life", "video", "work-life balance", "Ghana university"],
  },
  {
    id: "res9",
    title: "Local Ghanaian Foods for Brain Health and Mood Boost",
    type: "Article",
    Icon: FileText,
    description: "Discover local Ghanaian ingredients and simple recipes that can contribute to better mental clarity and a positive mood.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Ghanaian food market healthy colourful",
    category: "Well-being",
    tags: ["nutrition", "mental wellness", "Ghanaian food", "article"],
  },
  {
    id: "res10",
    title: "Online CBT Tools for Self-Help (Internationally Recognized)",
    type: "Tool",
    Icon: ExternalLink, // Changed to ExternalLink for tools
    description: "Access to internationally recognized Cognitive Behavioral Therapy (CBT) tools and apps that can be used for self-guided mental wellness.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "CBT app interface phone screen",
    category: "Self-Help Tools",
    tags: ["CBT", "self-help", "app", "tool", "mental health"],
  }
];

const ITEMS_PER_PAGE = 6;

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => ['all', ...Array.from(new Set(resourcesData.map(r => r.category)))], []);
  const types = useMemo(() => ['all', ...Array.from(new Set(resourcesData.map(r => r.type)))], []);

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-10 container mx-auto px-4 py-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-lg rounded-xl">
        <CardHeader className="pb-4 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mx-auto">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold font-headline tracking-tight">Mental Wellness Hub</h1>
          </div>
           <CardDescription className="text-lg text-muted-foreground pt-2 max-w-2xl mx-auto">
            Explore a curated collection of articles, videos, tools, and guided sessions from Accra TechMind to support your mental well-being.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
            <div className="relative md:col-span-1">
              <Input 
                type="search" 
                placeholder="Search resources..." 
                className="pl-10 h-12 text-base rounded-full focus:shadow-md" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-12 text-base rounded-full focus:shadow-md">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-base py-2">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-12 text-base rounded-full focus:shadow-md">
                 <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {types.map(type => (
                  <SelectItem key={type} value={type} className="text-base py-2">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      {paginatedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedResources.map(resource => (
            <Card key={resource.id} className="flex flex-col bg-card rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={resource.image} 
                  alt={resource.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={resource.dataAiHint}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow space-y-3">
                 <div className="flex items-center text-sm text-muted-foreground">
                    <resource.Icon className="w-4 h-4 mr-1.5 text-primary" />
                    <span>{resource.type}</span>
                    <span className="mx-1.5">•</span>
                    <span>{resource.category}</span>
                 </div>
                <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors flex-grow">{resource.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{resource.description}</p>
                 <Button asChild className="w-full btn-pill btn-card-action mt-auto py-3">
                  <Link href={resource.link} target={resource.link.startsWith('http') ? '_blank' : '_self'} rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                     {resource.link.startsWith('http') ? <ExternalLink className="mr-2 h-5 w-5" /> : <resource.Icon className="mr-2 h-5 w-5" />}
                     {resource.type === "Tool" && resource.id === "res5" ? "View Contacts" : "Access Resource"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg rounded-xl col-span-full">
          <CardContent className="pt-10 pb-8 text-center">
            <Image src="https://placehold.co/300x200.png" alt="No results found" width={200} height={133} className="mx-auto mb-6 rounded-lg shadow-md" data-ai-hint="magnifying glass empty Ghana" />
            <h3 className="text-2xl font-semibold mb-2">No Resources Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn't find any resources matching your current search and filter criteria. Try adjusting your terms or broadening your search.
            </p>
          </CardContent>
        </Card>
      )}
       
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              className="rounded-full h-10 w-10"
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            className="rounded-full h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>Please note: Some external links will open in a new tab. Accra TechMind is not responsible for the content of external sites.</p>
        <p className="mt-1">Images used are placeholders. For the best experience, these should be replaced with actual, high-quality, culturally relevant photos.</p>
      </div>
    </div>
  );
}
