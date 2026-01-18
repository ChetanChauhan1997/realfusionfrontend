"use client";

import { useState, useEffect } from "react";
import api from "@/services";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
import apiPaths from "@/config/ApiPath";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch downloads
  const fetchDownloads = async () => {
    try {
      const res = await api.get(apiPaths.GET_DOWNLOADS, {
        params: { search, page },
      });
      setDownloads(res.data.downloads);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [search, page]);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(downloads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Downloads");
    XLSX.writeFile(workbook, "downloads_report.xlsx");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Downloads Report</h1>
            <p className="text-muted-foreground">
              Track who downloaded which document.
            </p>
          </div>
          <Button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white"> <Download className="mr-2 h-4 w-4" /> Export Excel</Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by document..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Downloads Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Download Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.documentTitle}</TableCell>
                    <TableCell>{d.userName}</TableCell>
                    <TableCell>{d.userEmail}</TableCell>
                    <TableCell>{d.ipAddress}</TableCell>
                    <TableCell>
                      {new Date(d.downloadDate).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-end space-x-2">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
