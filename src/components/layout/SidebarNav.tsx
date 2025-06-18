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
import { LogOut } from 'lucide-react';

interface SidebarNavProps {
  navItems: NavItem[];
  userRole: 'student' | 'counselor' | 'admin';
}

export function SidebarNav({ navItems, userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const { open, state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader className="p-4 justify-center">
         {/* Logo only appears when sidebar is expanded or it's mobile */}
         { (state === "expanded" || open) && <AppLogo /> }
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== `/${userRole}/dashboard` && pathname.startsWith(item.href))}
                disabled={item.disabled}
                className={cn(
                  "justify-start text-base",
                  (state === "collapsed" && !open) && "justify-center"
                )}
                tooltip={ (state === "collapsed" && !open) ? item.title : undefined }
              >
                <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                  <item.icon className="mr-2 h-5 w-5 shrink-0" />
                  <span className={cn((state === "collapsed" && !open) && "sr-only")}>{item.title}</span>
                  {item.label && <span className="ml-auto">{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
         <Button variant="ghost" className={cn("w-full justify-start", (state === "collapsed" && !open) && "justify-center")} onClick={() => alert("Simulated logout")}>
            <LogOut className="mr-2 h-5 w-5 shrink-0" />
            <span className={cn((state === "collapsed" && !open) && "sr-only")}>Logout</span>
          </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
