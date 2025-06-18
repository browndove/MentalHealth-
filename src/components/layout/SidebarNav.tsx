'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/constants';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from './AppLogo';
import { Button } from '../ui/button';
import { 
  LogOut, 
  Home, 
  CalendarPlus, 
  Bot, 
  ClipboardList, 
  BookOpen, 
  Video, 
  UserCircle, 
  Users, 
  MessageSquare,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // For UserNav-like logout
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface SidebarNavProps {
  navItems: NavItem[];
  userRole: 'student' | 'counselor' | 'admin';
}

const iconComponents: { [key: string]: LucideIcon } = {
  Home,
  CalendarPlus,
  Bot,
  ClipboardList,
  BookOpen,
  Video,
  UserCircle,
  Users,
  MessageSquare,
  Settings,
};


export function SidebarNav({ navItems, userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const { open, state } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  };
  
  const userInitials = user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase() || (user?.email ? user.email[0].toUpperCase() : "U");

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 justify-start h-16 border-b border-sidebar-border">
         { (state === "expanded" || open) && <AppLogo /> }
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {navItems.map((item) => {
            const IconComponent = iconComponents[item.iconName] || Home; 
            const isActive = pathname === item.href || (item.href !== `/${userRole}/dashboard` && pathname.startsWith(item.href) && item.href.split('/').length > 2);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  disabled={item.disabled}
                  className={cn(
                    "justify-start text-sm h-10 px-3",
                    isActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    (state === "collapsed" && !open) && "justify-center"
                  )}
                  tooltip={ (state === "collapsed" && !open) ? item.title : undefined }
                >
                  <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                    <IconComponent className="mr-3 h-5 w-5 shrink-0" />
                    <span className={cn((state === "collapsed" && !open) && "sr-only")}>{item.title}</span>
                    {item.label && <span className="ml-auto text-xs opacity-70">{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border mt-auto">
         {user && (
          <div className={cn("flex items-center gap-2", (state === "collapsed" && !open) && "justify-center")}>
              <Avatar className="h-9 w-9">
                 <AvatarImage src={`https://placehold.co/40x40.png`} alt={user.fullName || "User"} data-ai-hint="user avatar" />
                 <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              {(state === "expanded" || open) && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user.fullName || "User"}</p>
                </div>
              )}
              <Button variant="ghost" size="icon" className={cn("text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", (state === "expanded" || open) ? "ml-auto" : "")} onClick={handleLogout} 
                aria-label="Logout"
                title={(state === "collapsed" && !open) ? "Logout" : undefined}
              >
                <LogOut className="h-5 w-5 shrink-0" />
              </Button>
          </div>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}
