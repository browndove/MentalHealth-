import { AppLogo } from "./AppLogo";
import { UserNav } from "./UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger

interface HeaderProps {
  showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* The SidebarTrigger is now always visible to toggle the sidebar */}
          {showSidebarTrigger && <SidebarTrigger />} 
          <AppLogo />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* Additional nav items can go here */}
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
