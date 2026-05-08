"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInventoryItem, useInventoryHistory } from "@/hooks/useInventory";
import { InventoryService } from "@/lib/inventoryService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from '@/lib/toast-utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, ArrowLeft, PackagePlus, History, BarChart3 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const { item, isLoading, mutate } = useInventoryItem(id);
    const { movements, isLoading: historyLoading } = useInventoryHistory({ inventoryId: id });

    const [restockOpen, setRestockOpen] = useState(false);
    const [restockQuantity, setRestockQuantity] = useState(1);
    const [restockReason, setRestockReason] = useState("");

    const handleRestock = async () => {
        try {
            await InventoryService.restock(id, Number(restockQuantity), restockReason);
            setRestockOpen(false);
            mutate(); // Refresh item data
            // Ideally refresh history too, but it's a separate hook. 
            // SWR revalidation might be needed on that key or just reload page.
            window.location.reload();
        } catch (err: any) {
            showToast.error(err.message);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!item) return <div className="p-8">Item not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{item.productId?.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <span className="font-mono bg-muted px-2 py-0.5 rounded">{item.sku}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }}></span>
                            {item.color}
                        </div>
                        <span>•</span>
                        <span>{item.size}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PackagePlus className="mr-2 h-4 w-4" /> Restock
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Restock Inventory</DialogTitle>
                                <DialogDescription>Add new stock to this item. This will be logged in history.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Quantity to Add</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={restockQuantity}
                                        onChange={(e) => setRestockQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason / Source</Label>
                                    <Input
                                        placeholder="e.g. Shipment #1234"
                                        value={restockReason}
                                        onChange={(e) => setRestockReason(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setRestockOpen(false)}>Cancel</Button>
                                <Button onClick={handleRestock}>Confirm Restock</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{item.totalStock}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Threshold: {item.lowStockThreshold}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reserved / Allocated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-amber-600">{item.reservedStock}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available to Sell: {item.totalStock - item.reservedStock}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.status === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xl font-semibold capitalize">{item.status.replace(/_/g, " ")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Location: {item.warehouseLocation || "N/A"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">Stock History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">SKU</span>
                                    <span className="font-mono">{item.sku}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Product ID</span>
                                    <span className="font-mono">{item.productId?._id}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Warehouse Location</span>
                                    <span>{item.warehouseLocation || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Shelf / Aisle</span>
                                    <span>{item.aisle || "-"} / {item.shelf || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Cost Price</span>
                                    <span>${item.costPrice?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Sold Count</span>
                                    <span>{item.soldCount || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Movement Log</CardTitle>
                            <CardDescription>Recent changes to stock levels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Stock (Before &rarr; After)</TableHead>
                                        <TableHead>Reason</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historyLoading ? (
                                        <TableRow><TableCell colSpan={5}>Loading history...</TableCell></TableRow>
                                    ) : movements?.length === 0 ? (
                                        <TableRow><TableCell colSpan={5}>No history found.</TableCell></TableRow>
                                    ) : (
                                        movements?.map((mov: any) => (
                                            <TableRow key={mov._id}>
                                                <TableCell className="whitespace-nowrap">{new Date(mov.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={
                                                        mov.type === 'IN' ? 'bg-green-50 text-green-700' :
                                                            mov.type === 'OUT' || mov.type === 'SOLD' ? 'bg-red-50 text-red-700' : ''
                                                    }>
                                                        {mov.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono">{mov.quantity}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground font-mono">
                                                    {mov.previousStock} &rarr; {mov.newStock}
                                                </TableCell>
                                                <TableCell className="text-sm max-w-[200px] truncate" title={mov.reason}>{mov.reason}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
