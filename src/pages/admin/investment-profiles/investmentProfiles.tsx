"use client";

import { useEffect, useState } from "react";
import api from "@/services";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Wallet,
  User,
  Mail,
  MapPin,
  Target,
  Home,
  Calendar,
  MessageSquare,
  Building2,
  ShieldAlert,
  TrendingUp,
  Download, // Added Download Icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx"; // Added XLSX Import

export default function InvestmentProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  // Modal State
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfiles = async (
    pageNum = 1,
    searchTerm = "",
    pageLimit = limit
  ) => {
    try {
      const res = await api.get("/investment-profiles", {
        params: { page: pageNum, limit: pageLimit, search: searchTerm },
      });
      setProfiles(res.data.data);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProfiles(page, search, limit);
  }, [page, search, limit]);

  const openDetails = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  // --- EXPORT TO EXCEL LOGIC ---
  const exportToExcel = () => {
    // Helper to clean JSON strings (e.g., '["Apartment"]' -> "Apartment")
    const cleanValue = (val: any) => {
      if (!val) return "";
      if (Array.isArray(val)) return val.join(", ");
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed.join(", ") : val;
      } catch {
        return val;
      }
    };

    // Format data for Excel
    const dataToExport = profiles.map((p) => ({
      "Full Name": p.full_name,
      Email: p.email,
      Budget: `AED ${p.budget}`,
      Timeline: p.timeline,
      "Holding Period": p.holding_period,
      Goals: cleanValue(p.goals),
      "Property Types": cleanValue(p.property_type),
      Bedrooms: cleanValue(p.bedrooms),
      Locations: cleanValue(p.locations),
      Developers: cleanValue(p.developers),
      Amenities: cleanValue(p.amenities),
      Comments: p.comments || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    // Auto-width for columns (optional visual improvement)
    const wscols = [
      { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 10 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 30 }
    ];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "investment_leads.xlsx");
  };
  // -----------------------------

  // Helper to render sections in Modal
  const DetailSection = ({ icon: Icon, label, value, isBadge = false }: any) => {
    let displayValues: string[] = [];

    if (isBadge && value) {
      if (Array.isArray(value)) {
        displayValues = value;
      } else if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) displayValues = parsed;
          else displayValues = [value];
        } catch (e) {
          displayValues = value.includes(",")
            ? value.split(",").map((s) => s.trim())
            : [value];
        }
      }
    }

    return (
      <div className="flex flex-col p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
            <Icon size={14} />
          </div>
          {label}
        </div>

        <div className="text-sm font-semibold text-slate-900">
          {isBadge && displayValues.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {displayValues.map((v: string, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="px-2.5 py-1 bg-slate-50 text-slate-700 border-slate-200 rounded-md font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                >
                  {v}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="pl-1">{value || "Not Specified"}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section with Export Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Investment Leads
            </h1>
            <p className="text-slate-500">
              Analyze property requirements and investor preferences.
            </p>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded-md px-3 py-1.5 text-sm bg-white"
              >
                <option value={5}>5 leads</option>
                <option value={10}>10 leads</option>
                <option value={25}>25 leads</option>
              </select>
            </div>
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-72"
            />
          </CardHeader>

          <CardContent className="pt-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow
                      key={p.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <TableCell>
                        <div className="font-bold text-slate-800">
                          {p.full_name}
                        </div>
                        <div className="text-xs text-slate-500">{p.email}</div>
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600">
                        AED {p.budget}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {p.timeline}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(p)}
                          className="hover:bg-blue-600 hover:text-white border-blue-200 text-blue-600 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between py-6">
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <span className="text-sm font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETAIL MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[60vw] md:max-w-[60vw] h-[85vh] p-0 overflow-hidden border-none shadow-2xl flex flex-col bg-white">
          {/* HEADER: Sticky/Fixed */}
          <DialogHeader className="p-6 bg-gradient-to-r from-[#017BFC] to-[#40D3B6] text-white shrink-0 relative">
            <DialogTitle className="text-2xl flex items-center gap-3">
              <User className="p-1 bg-white/20 rounded-lg" />
              Investor Profile: {selectedProfile?.full_name}
            </DialogTitle>
            <DialogDescription className="text-blue-100 flex items-center gap-2 mt-1">
              <Mail size={14} /> {selectedProfile?.email}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="p-6 h-full max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              <div className="md:col-span-2">
                <DetailSection
                  icon={Target}
                  label="Investment Goals"
                  value={selectedProfile?.goals}
                  isBadge
                />
              </div>
              {/* Financials & Strategy */}
              <DetailSection
                icon={Clock}
                label="Holding Period"
                value={selectedProfile?.holding_period}
              />
              <DetailSection
                icon={Wallet}
                label="Investment Budget"
                value={`AED ${selectedProfile?.budget}`}
              />

              {/* Property Details */}
              <DetailSection
                icon={Home}
                label="Property Types"
                value={selectedProfile?.property_type}
                isBadge
              />
              <DetailSection
                icon={Building2}
                label="Desired Bedrooms"
                value={selectedProfile?.bedrooms}
                isBadge
              />

              {/* Locations & Developers */}
              <div className="md:col-span-2">
                <DetailSection
                  icon={MapPin}
                  label="Preferred Locations"
                  value={selectedProfile?.locations}
                />
              </div>
              <div className="md:col-span-2">
                <DetailSection
                  icon={TrendingUp}
                  label="Must-have Amenities"
                  value={selectedProfile?.amenities}
                />
              </div>
              <div className="md:col-span-2">
                <DetailSection
                  icon={Building2}
                  label="Preferred Developers"
                  value={selectedProfile?.developers}
                />
              </div>

              {/* Risk Tolerance & Timeline */}
              <div className="md:col-span-2">
                <DetailSection
                  icon={Calendar}
                  label="Purchase Timeline"
                  value={selectedProfile?.timeline}
                />
              </div>

              {/* Concerns & Comments */}
              <div className="md:col-span-2 space-y-4 mt-2">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                    <MessageSquare size={16} /> Additional Comments
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedProfile?.comments || "No additional comments."}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}