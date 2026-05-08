"use client";

import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, AlertTriangle, PackageSearch } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { InventoryService } from "@/lib/inventoryService";

export default function InventoryPage() {
    const [filter, setFilter] = useState({ lowStock: false });
    const [search, setSearch] = useState("");
    const { inventory, isLoading, mutate } = useInventory(filter);

    // Status Badge Helper
    const getStatusBadge = (status: any) => {
        switch (status) {
            case "in_stock":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
            case "out_of_stock":
                return <Badge variant="destructive">Out of Stock</Badge>;
            case "discontinued":
                return <Badge variant="secondary">Discontinued</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Delete Handler
    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to delete this inventory item?")) return;
        try {
            await InventoryService.delete(id);
            mutate(); // Refresh list
        } catch (err: any) {
            alert(err.message);
        }
    }

    // Filtered Inventory (Client-side search if backend search not implemented for name)
    const filteredInventory = inventory?.filter((item: any) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            item.sku.toLowerCase().includes(searchLower) ||
            item.productId?.name?.toLowerCase().includes(searchLower) ||
            item.color.toLowerCase().includes(searchLower) ||
            item.size.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 py-0.5 px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            LIVE SYNC
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Manage stock levels, variants, and warehouse locations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => mutate()} disabled={isLoading}>
                        Refresh
                    </Button>
                    <Link href="/admin/inventory/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <PackageSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search SKU, Product, Color..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button
                    variant={filter.lowStock ? "destructive" : "outline"}
                    onClick={() => setFilter(prev => ({ ...prev, lowStock: !prev.lowStock }))}
                >
                    {filter.lowStock ? <AlertTriangle className="mr-2 h-4 w-4" /> : null}
                    Low Stock Only
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[280px]">Product Details</TableHead>
                            <TableHead>Inventory Status</TableHead>
                            <TableHead>Logistics</TableHead>
                            <TableHead>Supply Chain</TableHead>
                            <TableHead>Financials</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse font-medium">
                                        Fetching global inventory data...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredInventory?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No matching inventory records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInventory?.map((item: any) => {
                                const available = item.availableStock ?? (item.totalStock - (item.reservedStock || 0));
                                const lastUpdated = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A';

                                return (
                                    <TableRow key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                        {/* Product Details */}
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="font-bold text-gray-900 leading-tight">
                                                    {item.productId?.name || "Unknown Product"}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] font-mono py-0 tracking-tighter bg-gray-50">
                                                        {item.sku}
                                                    </Badge>
                                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                                                        {item.color !== "N/A" && (
                                                            <span
                                                                className="w-2.5 h-2.5 rounded-full border border-gray-200"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        )}
                                                        {item.size !== "N/A" ? item.size : "One Size"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Inventory Status */}
                                        <TableCell>
                                            <div className="flex items-end gap-3 relative">
                                                <div className="flex flex-col relative">
                                                    {available <= item.lowStockThreshold && (
                                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                                    )}
                                                    <span className={`text-3xl font-black tabular-nums tracking-tighter transition-all duration-500 ${available <= item.lowStockThreshold ? "text-red-600 scale-110" : item.reservedStock > 0 ? "text-amber-600" : "text-black"}`}>
                                                        {available}
                                                    </span>
                                                    <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-widest leading-none">Available</span>
                                                </div>
                                                <div className="flex flex-col border-l border-gray-100 pl-3 pb-0.5 space-y-0.5">
                                                    <div className="flex items-center gap-1.5 leading-none group/stat">
                                                        <span className="text-[11px] font-bold text-gray-600 group-hover/stat:text-black transition-colors">{item.totalStock}</span>
                                                        <span className="text-[9px] text-gray-400 uppercase font-bold">Total</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 leading-none group/stat">
                                                        <span className={`text-[11px] font-bold transition-colors ${item.reservedStock > 0 ? "text-amber-600 animate-pulse" : "text-gray-400"}`}>{item.reservedStock || 0}</span>
                                                        <span className="text-[9px] text-gray-400 uppercase font-bold text-amber-500/70">Reserved</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 leading-none group/stat">
                                                        <span className="text-[11px] font-bold text-blue-600 group-hover/stat:text-blue-800 transition-colors">{item.soldCount || 0}</span>
                                                        <span className="text-[9px] text-gray-400 uppercase font-bold text-blue-500/70">Sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Logistics */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] px-1.5 py-0 font-bold uppercase">
                                                        {item.warehouseLocation || 'Stock Room'}
                                                    </Badge>
                                                </div>
                                                {(item.aisle || item.shelf) && (
                                                    <div className="text-[11px] font-medium text-gray-500 flex gap-2">
                                                        {item.aisle && <span>Aisle: <span className="text-gray-900 font-bold">{item.aisle}</span></span>}
                                                        {item.shelf && <span>Shelf: <span className="text-gray-900 font-bold">{item.shelf}</span></span>}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Supply Chain */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]" title={item.supplier}>
                                                    {item.supplier || 'N/A'}
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    Batch: <span className="text-gray-600 bg-gray-50 px-1 py-0.5 rounded">{item.batchNumber || '—'}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Financials */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-[13px] font-black text-gray-900 tabular-nums">
                                                    INR {item.costPrice?.toLocaleString() || '0'}
                                                </div>
                                                <div className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Cost Price</div>
                                            </div>
                                        </TableCell>

                                        {/* Status & Date */}
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                {getStatusBadge(item.status)}
                                                <div className="text-[9px] text-gray-400 block font-medium group-hover:text-gray-500 transition-colors">
                                                    Update: {lastUpdated}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white border border-transparent hover:border-gray-200">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 shadow-2xl border-gray-200">
                                                    <DropdownMenuLabel className="text-[11px] uppercase tracking-widest font-black text-gray-400">Inventory Options</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.sku)} className="text-xs font-semibold py-2">
                                                        Copy SKU to Clipboard
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <Link href={`/admin/inventory/${item._id}`}>
                                                        <DropdownMenuItem className="text-xs font-semibold py-2">Edit Stock Details</DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem className="text-red-600 text-xs font-bold py-2" onClick={() => handleDelete(item._id)}>
                                                        Remove Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
