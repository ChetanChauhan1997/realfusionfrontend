"use client";

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import AuthGuard from '../AuthGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'
          }`}>
          <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapse={setSidebarCollapsed}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex flex-col w-full transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
          }`}>
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}