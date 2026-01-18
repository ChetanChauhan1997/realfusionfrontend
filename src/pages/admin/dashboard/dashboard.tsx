"use client";

import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Eye, MousePointer, FileText, Download, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/services';
import apiPaths from '@/config/ApiPath';

interface DashboardData {
  totalRegistraion: number;
  totalDocument: number;
  totalDownloads: number;
  totalContactUs: number;
}

interface MonthlyCount {
  name: string; // 'Jan', 'Feb', etc.
  totalRegistraion: number;
  totalDocument: number;
  totalDownloads: number;
  totalContactUs: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyCount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const fetchData = async (selectedYear: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`${apiPaths.ADMIN_DASHBOARD}?year=${selectedYear}`);

      if (res.data?.status) {
        setData(res.data.data);
        setMonthlyData(res.data.data.monthlyData || []);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Generate year options (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your website performance and user engagement metrics.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[{
            title: "Total Registration",
            icon: <Users className="h-6 w-6 text-white" />,
            value: data?.totalRegistraion ?? '-',
            bg: "bg-blue-500"
          },
          {
            title: "Total Reports",
            icon: <FileText className="h-6 w-6 text-white" />,
            value: data?.totalDocument ?? '-',
            bg: "bg-green-500"
          },
          {
            title: "Total Downloads",
            icon: <Download className="h-6 w-6 text-white" />,
            value: data?.totalDownloads ?? '-',
            bg: "bg-yellow-500"
          },
          {
            title: "Total Contact Us",
            icon: <MessageSquare className="h-6 w-6 text-white" />,
            value: data?.totalContactUs ?? '-',
            bg: "bg-red-500"
          }
          ].map((card, idx) => (
            <Card key={idx} className="flex flex-col justify-between h-36 p-4">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded ${card.bg}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-end">
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Year Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="year" className="font-medium">Select Year:</label>
          <select
            id="year"
            value={year}
            onChange={handleYearChange}
            className="border rounded p-1"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Monthly Analytics Chart */}
        <div className="grid lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Analytics ({year})</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <p>No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalRegistraion" name="Total Registrations" fill="#8884d8" />
                    <Bar dataKey="totalDocument" name="Total Reports" fill="#82ca9d" />
                    <Bar dataKey="totalDownloads" name="Total Downloads" fill="#ffc658" />
                    <Bar dataKey="totalContactUs" name="Total Contact Us" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
