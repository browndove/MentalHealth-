
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

// Updated resourcesData with real-world links and content
const resourcesData: Resource[] = [
  {
    id: "res1",
    title: "Doing What Matters in Times of Stress",
    type: "Article",
    Icon: FileText,
    description: "An illustrated guide from the World Health Organization (WHO) providing practical skills to help cope with stress.",
    link: "https://www.who.int/publications/i/item/9789240003927",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "person reading calm book",
    category: "Stress Management",
    tags: ["stress", "coping", "mental health", "article", "who", "guide"],
    buttonStyle: 'primary',
  },
  {
    id: "res2",
    title: "Guided Meditation for Positive Energy (10 min)",
    type: "Guided Session",
    Icon: Sparkles,
    description: "A short guided audio meditation from 'Goodful' to help you release negative thoughts and embrace positivity. Suitable for a quick reset.",
    link: "https://www.youtube.com/watch?v=FE_Al2g-R4k",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "serene nature peaceful meditation",
    category: "Mindfulness & Relaxation",
    tags: ["meditation", "stress", "audio", "mindfulness", "positive energy", "guided session"],
    buttonStyle: 'teal',
  },
  {
    id: "res3",
    title: "How to Beat Procrastination",
    type: "Video",
    Icon: Youtube,
    description: "An animated video explaining the science behind procrastination and offering actionable strategies to overcome it.",
    link: "https://www.youtube.com/watch?v=QvJonesoF2M",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "student focused at desk video",
    category: "Academic Support",
    tags: ["study skills", "video", "time management", "academic", "procrastination"],
    buttonStyle: 'teal',
  },
  {
    id: "res4",
    title: "Basic psychological first aid",
    type: "Article",
    Icon: FileText,
    description: "Learn how to provide practical and emotional support to people who have experienced a crisis event. A guide from the British Red Cross.",
    link: "https://www.redcross.org.uk/get-help/get-help-with-loneliness/wellbeing-support/psychological-first-aid-for-crises",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "hands supporting another person",
    category: "Crisis Support",
    tags: ["first aid", "health", "article", "wellbeing", "support"],
    buttonStyle: 'primary',
  },
  {
    id: "res5",
    title: "Mental health and substance use",
    type: "Tool",
    Icon: ShieldCheck,
    description: "An informational page from the World Health Organization about the connection between mental health and substance use.",
    link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-and-substance-use",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "diverse community support",
    category: "Crisis Support",
    tags: ["emergency", "substance use", "support", "crisis", "who"],
    buttonStyle: 'teal',
  },
  {
    id: "res6",
    title: "Mental Health of Adolescents",
    type: "Article",
    Icon: FileText,
    description: "A fact sheet from the WHO discussing the determinants of mental health and common conditions among adolescents.",
    link: "https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "teenager friends talking",
    category: "Mental Health Conditions",
    tags: ["depression", "community support", "adolescent health", "article"],
    buttonStyle: 'primary',
  },
   {
    id: "res7",
    title: "The Power of Mindful Walking",
    type: "Guided Session",
    Icon: PlayCircle,
    description: "An immersive audio guide for a mindful walking experience, perfect for de-stressing between classes or at the end of the day.",
    link: "https://www.youtube.com/watch?v=4-0-A0H94d4",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "person walking park path",
    category: "Mindfulness & Relaxation",
    tags: ["mindfulness", "audio", "nature therapy", "walking", "guided session"],
    buttonStyle: 'teal',
  },
  {
    id: "res8",
    title: "Breaking the stigma around mental health",
    type: "Video",
    Icon: Youtube,
    description: "A short, powerful video from UNICEF about the importance of talking about mental health and breaking down stigma.",
    link: "https://www.youtube.com/watch?v=P_S3hr1i02s",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "diverse people talking video",
    category: "Student Life",
    tags: ["student life", "video", "stigma", "mental health"],
    buttonStyle: 'teal',
  },
  {
    id: "res9",
    title: "Healthy Diet: A Key to Well-being",
    type: "Article",
    Icon: FileText,
    description: "A fact sheet from the WHO on what constitutes a healthy diet and its importance for physical and mental health.",
    link: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "healthy food vibrant market",
    category: "Well-being",
    tags: ["nutrition", "mental wellness", "healthy diet", "article"],
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
