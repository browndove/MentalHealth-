import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { counselorNavItems } from "@/lib/constants";

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarNav navItems={counselorNavItems} userRole="counselor" />
      <SidebarRail />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
