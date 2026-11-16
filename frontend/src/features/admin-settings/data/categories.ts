import {
  Bell,
  CreditCard,
  Route as RouteIcon,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SettingsCategory } from '../types';

export const SETTINGS_CATEGORIES: Array<{ id: SettingsCategory; label: string; icon: LucideIcon }> = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'user-management', label: 'User Management', icon: Users },
  { id: 'payment', label: 'Payment Settings', icon: CreditCard },
  { id: 'route', label: 'Route Settings', icon: RouteIcon },
  { id: 'system-logs', label: 'System Logs', icon: ScrollText },
];
