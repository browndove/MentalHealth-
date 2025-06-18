import { Home, CalendarPlus, Bot, BookOpen, UserCircle, Users, ClipboardList, MessageSquare, Video, SettingsIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
};

export const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/student/dashboard', icon: Home },
  { title: 'Request Appointment', href: '/student/appointments/request', icon: CalendarPlus },
  { title: 'AI Assistant', href: '/student/ai-assistant', icon: Bot },
  { title: 'My Sessions', href: '/student/sessions', icon: ClipboardList },
  { title: 'Resources', href: '/student/resources', icon: BookOpen },
  { title: 'Video Call', href: '/session/placeholder-id/video', icon: Video, disabled: true }, // Example, enable when session active
  { title: 'Profile', href: '/student/profile', icon: UserCircle },
];

export const counselorNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/counselor/dashboard', icon: Home },
  { title: 'My Students', href: '/counselor/students', icon: Users },
  { title: 'Appointments', href: '/counselor/appointments', icon: CalendarPlus },
  { title: 'Session Notes', href: '/counselor/notes', icon: MessageSquare }, // General notes or link to specific session notes
  { title: 'Video Call', href: '/session/placeholder-id/video', icon: Video, disabled: true },
  { title: 'Profile', href: '/counselor/profile', icon: UserCircle },
];

export const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { title: 'Manage Users', href: '/admin/users', icon: Users },
    { title: 'Manage Counselors', href: '/admin/counselors', icon: Users },
    { title: 'System Analytics', href: '/admin/analytics', icon: SettingsIcon /* Replace with better icon e.g. BarChart */},
    { title: 'Reports', href: '/admin/reports', icon: ClipboardList },
];

export const APP_NAME = "Accra TechMind";
