"use client";

import { useState, useEffect } from "react";
import api from "@/services";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import apiPaths from "@/config/ApiPath";

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "inactive":
      return <Badge variant="outline">Inactive</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    file: null as File | null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const res = await api.get(apiPaths.GET_DOCUMENTS, { params: { search, page } });
      setDocuments(res.data.documents);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [search, page]);

  // Open modal for Add or Edit
  const openModal = (doc?: any) => {
    if (doc) {
      setSelectedDoc(doc);
      setFormData({
        title: doc.title,
        description: doc.description,
        status: doc.status,
        file: null,
      });
    } else {
      setSelectedDoc(null);
      setFormData({ title: "", description: "", status: "active", file: null });
    }
    setIsModalOpen(true);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  // Handle form submit (Add / Edit)
  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("status", formData.status);
      if (formData.file) data.append("file", formData.file);

      const url = selectedDoc ? `/documents/${selectedDoc.id}` : "/documents";
      const method = selectedDoc ? "put" : "post";

      await api({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete document
  const handleDelete = async () => {
    if (!selectedDoc) return;
    try {
      await api.delete(`${apiPaths.DELETE_DOCUMENTS}/${selectedDoc.id}`);
      setIsDeleteModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  // View document in new tab
  const viewDocument = (file: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${file}`;
    window.open(url, "_blank");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Manage your reports with upload.</p>
          </div>
          <Button onClick={() => openModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Report
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Documents Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.description}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => viewDocument(doc.file_path)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openModal(doc)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedDoc ? "Edit Report" : "Add Report"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Reprot Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input type="file" onChange={handleFileChange} />
              {formData.file && (
                <p className="text-sm text-muted-foreground">Selected file: {formData.file.name}</p>
              )}
              <Input
                placeholder="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>{selectedDoc ? "Update" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete "{selectedDoc?.title}"?</p>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
