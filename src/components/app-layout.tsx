'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Globe, Settings, LayoutDashboard, GanttChartSquare, FileText, FilePenLine, MessageSquare } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const iconMap: { [key: string]: LucideIcon } = {
  LayoutDashboard,
  GanttChartSquare,
  FileText,
  FilePenLine,
  MessageSquare,
};

export interface NavLink {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface AppLayoutProps {
  navLinks: NavLink[];
  userName: string;
  userRole: string;
  userAvatar?: string;
  children: React.ReactNode;
}

export function AppLayout({ navLinks, userName, userRole, userAvatar, children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold font-headline">CollaboSphere</h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => {
              const Icon = iconMap[link.icon];
              return (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton isActive={pathname.startsWith(link.href)} tooltip={link.label}>
                    {Icon && <Icon />}
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-sidebar-accent">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={userAvatar} alt={userName} data-ai-hint="person" />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <Link href="/" passHref>
                    <DropdownMenuItem>
                        Logout
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between h-16 p-4 border-b">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden text-2xl font-semibold md:block">
            {navLinks.find(link => pathname.startsWith(link.href))?.label}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Link href="/" className="hidden md:block">
              <Button variant="outline">Logout</Button>
            </Link>
          </div>
        </header>
        <main className="p-4 bg-muted/20 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
