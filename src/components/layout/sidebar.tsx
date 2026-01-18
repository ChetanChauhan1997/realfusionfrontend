"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  Menu,
  ChevronLeft,
  Home,
  Package,
  File,
  LayoutDashboard,
  FileText,
  Download,
  Users,
  MessageSquare,
  Briefcase,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard, // dashboard icon
  },
  {
    title: "Reports",
    href: "/admin/document",
    icon: FileText, // document icon
  },
  {
    title: "Downloads",
    href: "/admin/downloads",
    icon: Download, // download icon
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users, // users icon
  },
  {
    title: "Investment Profiles",
    href: "/admin/investment-profiles",
    icon: Briefcase, // Professional/Business Portfolio style
  },
  {
    title: "Contact Us",
    href: "/admin/contact-us",
    icon: MessageSquare, // message/chat icon
  },
  // {
  //   title: 'Analytics',
  //   href: '/admin/analytics',
  //   icon: BarChart3,
  // },
  // {
  //   title: 'Products',
  //   href: '/admin/products',
  //   icon: Package,
  // },
  // {
  //   title: 'Orders',
  //   href: '/admin/orders',
  //   icon: ShoppingCart,
  // },
  // {
  //   title: 'Reports',
  //   href: '/admin/reports',
  //   icon: FileText,
  // },
  // {
  //   title: 'Settings',
  //   href: '/admin/settings',
  //   icon: Settings,
  // },
];

interface SidebarProps {
  className?: string;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ className, collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "pb-12 min-h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-6">
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                collapsed ? "justify-center" : "space-x-2"
              )}
            >
              <Home className="h-6 w-6" />
              {!collapsed && (
                <h2 className="text-lg font-semibold tracking-tight">
                  Admin Panel
                </h2>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCollapse(!collapsed)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          {collapsed && (
            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCollapse(!collapsed)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          )}
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200",
                  collapsed ? "justify-center px-2" : "justify-start px-3",
                  pathname === item.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-1 mt-6">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
