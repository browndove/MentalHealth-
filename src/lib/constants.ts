
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  iconName: string; // Using string name to avoid circular dependencies
  label?: string;
  disabled?: boolean;
  external?: boolean;
};

export const studentNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/student/dashboard', iconName: 'Home' },
  { title: 'Request Appointment', href: '/student/appointments/request', iconName: 'CalendarPlus' },
  { title: 'My Sessions', href: '/student/sessions', iconName: 'ClipboardList' },
  { title: 'AI Assistant', href: '/student/ai-assistant', iconName: 'Bot' },
  { title: 'Resources', href: '/student/resources', iconName: 'BookOpen' },
  { title: 'Video Call', href: '/session/placeholder-id/video', iconName: 'Video' },
  { title: 'Profile', href: '/student/profile', iconName: 'UserCircle' },
];

export const counselorNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/counselor/dashboard', iconName: 'Home' },
  { title: 'Appointments', href: '/counselor/appointments', iconName: 'CalendarPlus' },
  { title: 'My Students', href: '/counselor/students', iconName: 'Users' },
  { title: 'Session Notes', href: '/counselor/notes', iconName: 'MessageSquare' },
  { title: 'Video Call', href: '/session/placeholder-id/video', iconName: 'Video' },
  { title: 'Profile', href: '/counselor/profile', iconName: 'UserCircle' },
];

export const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', iconName: 'Home' },
    { title: 'Manage Users', href: '/admin/users', iconName: 'Users' },
    { title: 'Manage Counselors', href: '/admin/counselors', iconName: 'Users' },
    { title: 'System Analytics', href: '/admin/analytics', iconName: 'Settings' },
    { title: 'Reports', href: '/admin/reports', iconName: 'ClipboardList' },
];

export const APP_NAME = "Accra TechMind";
