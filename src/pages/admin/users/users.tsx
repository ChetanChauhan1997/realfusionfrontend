"use client";

import { useEffect, useState } from "react";
import api from "@/services";
import apiPaths from "@/config/ApiPath";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(5);

    const fetchUsers = async (pageNum = 1, searchTerm = "", pageLimit = limit) => {
        try {
            const res = await api.get(apiPaths.GET_USERS, {
                params: { page: pageNum, limit: pageLimit, search: searchTerm },
            });
            setUsers(res.data.users);
            setPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers(page, search, limit);
    }, [page, search, limit]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // reset to first page when searching
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Registered Users</h1>
                        <p className="text-muted-foreground">
                            List of all users with their roles.
                        </p>
                    </div>
                </div>
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex justify-between w-full">
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="border rounded-md px-2 py-1 text-sm"
                            >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                            </select>
                            <Input
                                placeholder="Search by name..."
                                value={search}
                                onChange={handleSearch}
                                className="w-64"
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="border">
                                <TableHeader className="bg-muted sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email Id</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.map((u, index) => (
                                            <TableRow
                                                key={u.id}
                                                className="hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{u.name}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{u.phone_no}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${u.role === "admin"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                            }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
