
import type { NavItem } from '@/components/layout/SidebarNav';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MessageSquare,
  UserCircle,
  Users,
  NotebookPen,
  FileText,
  Bot
} from 'lucide-react';

export const studentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/student/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Sessions',
    href: '/student/sessions',
    icon: Calendar,
  },
  {
    title: 'Resources',
    href: '/student/resources',
    icon: BookOpen,
  },
  {
    title: 'AI Assistant',
    href: '/student/ai-assistant',
    icon: Bot,
  },
  {
    title: 'My Profile',
    href: '/student/profile',
    icon: UserCircle,
  },
];

export const counselorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/counselor/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Appointments',
    href: '/counselor/appointments',
    icon: Calendar,
  },
  {
    title: 'My Students',
    href: '/counselor/students',
    icon: Users,
  },
  {
    title: 'Session Notes',
    href: '/counselor/notes',
    icon: NotebookPen,
  },
  {
    title: 'My Profile',
    href: '/counselor/profile',
    icon: UserCircle,
  },
];
