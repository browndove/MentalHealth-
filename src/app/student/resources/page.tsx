
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, FileText, Youtube, Headphones, ShieldCheck, ExternalLink, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from '@/lib/utils';

interface Resource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Audio' | 'Tool';
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
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "Ghanaian student studying calmly",
    category: "Academic Stress",
    tags: ["anxiety", "coping", "mental health", "article", "ATU", "exam stress"],
  },
  {
    id: "res2",
    title: "Guided Adhan/Azan Meditation for Inner Peace (10 min)",
    type: "Audio",
    Icon: Headphones,
    description: "A short guided audio meditation incorporating calming Adhan/Azan elements, designed to help reduce stress and promote relaxation in a culturally resonant way.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "serene mosque Ghana audio",
    category: "Mindfulness & Relaxation",
    tags: ["meditation", "stress", "audio", "mindfulness", "Ghanaian culture", "Islamic meditation"],
  },
  {
    id: "res3",
    title: "Effective Study Habits for Success at Ghanaian Universities",
    type: "Video",
    Icon: Youtube,
    description: "A video guide by a University of Ghana learning specialist on developing effective study techniques and time management skills relevant to the Ghanaian academic environment.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "Legon student video lecture",
    category: "Academic Support",
    tags: ["study skills", "video", "time management", "academic", "Ghana university"],
  },
  {
    id: "res4",
    title: "Building Healthy Sleep Habits for Peak Performance",
    type: "Article",
    Icon: FileText,
    description: "Learn about the importance of sleep for mental and physical health, with tips for improving sleep hygiene in a tropical climate.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "peaceful night Accra",
    category: "Well-being",
    tags: ["sleep", "health", "article", "wellbeing", "tropical health"],
  },
  {
    id: "res5",
    title: "Ghana Mental Health Crisis Hotlines & Emergency Contacts",
    type: "Tool",
    Icon: ShieldCheck,
    description: "A vital list of verified phone numbers and resources for immediate mental health support and crisis situations within Ghana.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "emergency support Ghana",
    category: "Crisis Support",
    tags: ["emergency", "hotline", "support", "crisis", "Ghana mental health"],
  },
  {
    id: "res6",
    title: "Understanding Depression: Signs and Support in Our Community",
    type: "Article",
    Icon: FileText,
    description: "A culturally sensitive article discussing the signs of depression and how to seek or offer support within the Ghanaian community context.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "support group Ghana",
    category: "Mental Health Conditions",
    tags: ["depression", "community support", "Ghana", "article"],
  },
   {
    id: "res7",
    title: "Mindful Walking at Aburi Botanical Gardens (Audio Guide)",
    type: "Audio",
    Icon: Headphones,
    description: "An immersive audio guide for a mindful walking experience, designed to be used at Aburi Botanical Gardens or any serene natural space in Ghana.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "Aburi Gardens serene audio",
    category: "Mindfulness & Relaxation",
    tags: ["mindfulness", "audio", "nature therapy", "Aburi", "Ghana"],
  },
  {
    id: "res8",
    title: "Balancing Studies and Social Life at University in Ghana",
    type: "Video",
    Icon: Youtube,
    description: "Ghanaian student vloggers share tips and experiences on managing academic workload while maintaining a healthy social life at university.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "Ghanaian students socializing campus",
    category: "Student Life",
    tags: ["student life", "video", "work-life balance", "Ghana university"],
  },
  {
    id: "res9",
    title: "Local Ghanaian Foods for Brain Health and Mood Boost",
    type: "Article",
    Icon: FileText,
    description: "Discover local Ghanaian ingredients and simple recipes that can contribute to better mental clarity and a positive mood.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "Ghanaian food market healthy",
    category: "Well-being",
    tags: ["nutrition", "mental wellness", "Ghanaian food", "article"],
  },
  {
    id: "res10",
    title: "Online CBT Tools for Self-Help (Internationally Recognized)",
    type: "Tool",
    Icon: ExternalLink,
    description: "Access to internationally recognized Cognitive Behavioral Therapy (CBT) tools and apps that can be used for self-guided mental wellness.",
    link: "#", // Replace with actual link
    image: "https://placehold.co/600x400.png",
    dataAiHint: "CBT app interface",
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
    <div className="space-y-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-headline tracking-tight">Mental Health Resources</h1>
            </div>
          </div>
           <CardDescription className="text-lg text-muted-foreground pt-2">
            Explore a curated collection of articles, videos, tools, and other resources from Accra TechMind to support your mental well-being.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-1">
              <Input 
                type="search" 
                placeholder="Search by keyword, title, tag..." 
                className="pl-10 h-11 text-base" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-11 text-base">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-base">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-11 text-base">
                 <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type} className="text-base">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      {paginatedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResources.map(resource => (
            <Card key={resource.id} className="flex flex-col overflow-hidden shadow-lg rounded-xl group transition-all duration-300 hover:shadow-2xl">
              <div className="relative h-52 w-full overflow-hidden">
                <Image 
                  src={resource.image} 
                  alt={resource.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={resource.dataAiHint}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                 <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                    <resource.Icon className="h-4 w-4" />
                    {resource.type}
                 </div>
              </div>
              <CardHeader className="pt-5 pb-3">
                <CardTitle className="text-xl font-headline leading-tight group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                <CardDescription className="text-xs text-primary pt-1">{resource.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-5 px-5">
                <Button asChild className="w-full text-base py-3 transition-colors duration-300 hover:bg-accent hover:text-accent-foreground" size="lg">
                  <Link href={resource.link} target={resource.link.startsWith('http') ? '_blank' : '_self'} rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                    {resource.link.startsWith('http') ? <ExternalLink className="mr-2 h-5 w-5" /> : <resource.Icon className="mr-2 h-5 w-5" />}
                     {resource.type === "Tool" && resource.id === "res5" ? "View Contacts" : "Access Resource"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg rounded-xl">
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
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Please note: Some external links will open in a new tab. Accra TechMind is not responsible for the content of external sites.</p>
        <p className="mt-1">Images used are placeholders. For the best experience, these should be replaced with actual, high-quality, culturally relevant photos.</p>
      </div>
    </div>
  );
}
