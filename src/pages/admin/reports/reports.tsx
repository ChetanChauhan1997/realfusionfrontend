"use client";

import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Download, FileText, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

const salesData = [
  { month: 'Jan', sales: 4000, orders: 240, customers: 120 },
  { month: 'Feb', sales: 3000, orders: 198, customers: 98 },
  { month: 'Mar', sales: 2000, orders: 180, customers: 89 },
  { month: 'Apr', sales: 2780, orders: 208, customers: 103 },
  { month: 'May', sales: 1890, orders: 189, customers: 94 },
  { month: 'Jun', sales: 2390, orders: 239, customers: 119 },
  { month: 'Jul', sales: 3490, orders: 349, customers: 174 },
];

const categoryData = [
  { category: 'Electronics', revenue: 45000, orders: 234 },
  { category: 'Clothing', revenue: 32000, orders: 189 },
  { category: 'Home & Garden', revenue: 28000, orders: 156 },
  { category: 'Sports', revenue: 21000, orders: 123 },
  { category: 'Books', revenue: 15000, orders: 98 },
];

const reports = [
  {
    title: 'Sales Report',
    description: 'Monthly sales performance and trends',
    type: 'PDF',
    size: '2.4 MB',
    date: '2024-01-15',
  },
  {
    title: 'Customer Analytics',
    description: 'Customer behavior and demographics',
    type: 'Excel',
    size: '1.8 MB',
    date: '2024-01-14',
  },
  {
    title: 'Inventory Report',
    description: 'Stock levels and product performance',
    type: 'PDF',
    size: '3.2 MB',
    date: '2024-01-13',
  },
  {
    title: 'Financial Summary',
    description: 'Revenue, expenses, and profit analysis',
    type: 'PDF',
    size: '1.5 MB',
    date: '2024-01-12',
  },
];

export default function Reports() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and download detailed business reports.
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Report Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$141,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.5%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,800</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8.2%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">897</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+15.3%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.5%</div>
              <p className="text-xs text-muted-foreground">
                Monthly growth rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>{report.type}</span>
                        <span>{report.size}</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}