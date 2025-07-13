
'use client';

import { UserNav } from '@/components/layout/UserNav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { studentNavItems, counselorNavItems } from '@/lib/constants';

export function Header() {
  const { user } = useAuth();
  const navItems = user?.role === 'student' ? studentNavItems : counselorNavItems;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col">
            <SidebarNav navItems={navItems} userRole={user?.role || 'student'} isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
