
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, FileText, Youtube, Headphones, ShieldCheck, ExternalLink, Filter, ChevronLeft, ChevronRight, PlayCircle, Sparkles, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Audio' | 'Tool' | 'Guided Session';
  Icon: React.ElementType;
  description: string;
  link: string; // Can be internal path or external URL
  image: string;
  dataAiHint: string;
  category: string; // e.g., "Anxiety", "Stress Management", "Academic Support"
  tags: string[];
  buttonStyle?: 'primary' | 'teal'; // To control button color
}

// Updated resourcesData with Ghanaian context and varied content
const resourcesData: Resource[] = [
  {
    id: "res1",
    title: "Understanding and Managing Anxiety",
    type: "Article",
    Icon: FileText,
    description: "An in-depth article on recognizing anxiety symptoms and practical coping strategies, tailored for students in Ghana. Published by ATU Wellness.",
    link: "#", 
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Ghanaian student calm reflective library",
    category: "Anxiety",
    tags: ["anxiety", "coping", "mental health", "article", "ATU", "Ghana"],
    buttonStyle: 'primary',
  },
  {
    id: "res2",
    title: "Guided Meditation for Stress Relief (10 min)",
    type: "Guided Session",
    Icon: Sparkles, // More evocative for meditation/relaxation
    description: "A short guided audio meditation designed to help reduce stress and promote relaxation. Suitable for beginners. Features calming sounds of Ghanaian nature.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "serene Aburi gardens meditation Ghana",
    category: "Stress Management",
    tags: ["meditation", "stress", "audio", "mindfulness", "Ghana", "guided session"],
    buttonStyle: 'teal',
  },
  {
    id: "res3",
    title: "Effective Study Habits for Academic Success",
    type: "Video",
    Icon: Youtube,
    description: "A video guide by a University of Ghana learning specialist on developing effective study techniques and time management skills relevant to the Ghanaian academic environment.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "University of Ghana student studying focused video",
    category: "Academic Support",
    tags: ["study skills", "video", "time management", "academic", "Ghana university"],
    buttonStyle: 'teal',
  },
  {
    id: "res4",
    title: "Building Healthy Sleep Habits in Accra",
    type: "Article",
    Icon: FileText,
    description: "Learn about the importance of sleep for mental and physical health, with tips for improving sleep hygiene in a tropical urban setting like Accra.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "peaceful night scene Accra bedroom",
    category: "Well-being",
    tags: ["sleep", "health", "article", "wellbeing", "Accra"],
    buttonStyle: 'primary',
  },
  {
    id: "res5",
    title: "Ghana Mental Health Hotlines & Support Directory",
    type: "Tool",
    Icon: ShieldCheck,
    description: "A vital directory of verified phone numbers and resources for immediate mental health support and crisis situations within Ghana.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "support hands diverse Ghana",
    category: "Crisis Support",
    tags: ["emergency", "hotline", "support", "crisis", "Ghana mental health"],
    buttonStyle: 'teal',
  },
  {
    id: "res6",
    title: "Understanding Depression in Our Community",
    type: "Article",
    Icon: FileText,
    description: "A culturally sensitive article discussing the signs of depression and how to seek or offer support within the Ghanaian community context.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "community support group Ghana discussion",
    category: "Mental Health Conditions",
    tags: ["depression", "community support", "Ghana", "article"],
    buttonStyle: 'primary',
  },
   {
    id: "res7",
    title: "Mindful Walking: A Volta River Reflection (Audio)",
    type: "Guided Session",
    Icon: PlayCircle,
    description: "An immersive audio guide for a mindful walking experience, drawing inspiration from the serene Volta River landscapes.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Volta River serene nature audio",
    category: "Mindfulness & Relaxation",
    tags: ["mindfulness", "audio", "nature therapy", "Volta River", "Ghana", "guided session"],
    buttonStyle: 'teal',
  },
  {
    id: "res8",
    title: "Balancing Studies & Social Life: ATU Student Perspectives",
    type: "Video",
    Icon: Youtube,
    description: "ATU students share tips and experiences on managing academic workload while maintaining a healthy social life on campus.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "ATU students socializing campus life video",
    category: "Student Life",
    tags: ["student life", "video", "work-life balance", "ATU Ghana"],
    buttonStyle: 'teal',
  },
  {
    id: "res9",
    title: "Nourish Your Mind: Ghanaian Foods for Brain Health",
    type: "Article",
    Icon: FileText,
    description: "Discover local Ghanaian ingredients and simple recipes that can contribute to better mental clarity and a positive mood.",
    link: "#",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Ghanaian food market vibrant healthy",
    category: "Well-being",
    tags: ["nutrition", "mental wellness", "Ghanaian food", "article"],
    buttonStyle: 'primary',
  },
];

const ITEMS_PER_PAGE = 6;

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => ['All Categories', ...Array.from(new Set(resourcesData.map(r => r.category)))], []);
  const types = useMemo(() => ['All Types', ...Array.from(new Set(resourcesData.map(r => r.type)))], []);

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory;
      const matchesType = selectedType === 'All Types' || resource.type === selectedType;
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
    <div className="space-y-8 container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground mt-1 max-w-2xl">
            Explore a curated collection of articles, videos, tools, and other resources to support your mental well-being.
          </p>
        </div>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Input 
            type="search" 
            placeholder="Search resources by keyword..." 
            className="pl-10 h-11 text-sm rounded-lg border-input-border focus:ring-primary focus:border-primary" 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

       <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-11 text-sm rounded-lg border-input-border data-[placeholder]:text-muted-foreground">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {categories.map(category => (
              <SelectItem key={category} value={category} className="text-sm py-2">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-11 text-sm rounded-lg border-input-border data-[placeholder]:text-muted-foreground">
              <Info className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {types.map(type => (
              <SelectItem key={type} value={type} className="text-sm py-2">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {paginatedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {paginatedResources.map(resource => (
            <Card key={resource.id} className="flex flex-col bg-card rounded-xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={resource.image} 
                  alt={resource.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={resource.dataAiHint}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-5 flex flex-col flex-grow space-y-2.5">
                 <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <resource.Icon className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    <span>{resource.type} {resource.category !== resource.type ? `• ${resource.category}` : ''}</span>
                 </div>
                <CardTitle className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors flex-grow">{resource.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{resource.description}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                 <Button asChild className={`w-full btn-pill ${resource.buttonStyle === 'teal' ? 'btn-card-action-teal' : 'btn-card-action'}`}>
                  <Link href={resource.link} target={resource.link.startsWith('http') ? '_blank' : '_self'} rel={resource.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                     {resource.link.startsWith('http') ? <ExternalLink className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
                     Visit Resource
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md rounded-xl col-span-full border border-border">
          <CardContent className="pt-10 pb-8 text-center">
            <Image src="https://placehold.co/200x150.png" alt="No results found" width={150} height={112} className="mx-auto mb-6 rounded-lg shadow-sm" data-ai-hint="magnifying glass empty results Ghana" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Resources Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Sorry, we couldn't find any resources matching your current search and filter criteria. Try adjusting your terms or broadening your search.
            </p>
          </CardContent>
        </Card>
      )}
       
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className="rounded-full h-9 w-9 border-input-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              className="rounded-full h-9 w-9 border-input-border"
            >
             <span className="text-xs">{pageNumber}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            className="rounded-full h-9 w-9 border-input-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
