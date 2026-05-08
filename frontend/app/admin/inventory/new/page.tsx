"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InventoryService } from "@/lib/inventoryService";
import { showToast } from '@/lib/toast-utils';
import { Loader2, Plus, Trash2 } from "lucide-react";

interface VariantRow {
    id: string;
    size: string;
    color: string;
    sku: string;
    totalStock: number;
    lowStockThreshold: number;
    costPrice: number;
}

export default function NewInventoryPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [productId, setProductId] = useState("");

    // Common warehouse fields for all variants
    const [commonData, setCommonData] = useState({
        warehouseLocation: "",
        aisle: "",
        shelf: "",
        supplier: "",
    });

    // Table rows for variants
    const [variants, setVariants] = useState<VariantRow[]>([
        {
            id: crypto.randomUUID(),
            size: "N/A",
            color: "N/A",
            sku: "",
            totalStock: 0,
            lowStockThreshold: 5,
            costPrice: 0,
        }
    ]);

    useEffect(() => {
        // Fetch products for dropdown
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : data.products || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleProductChange = (pid: string) => {
        const product = products.find((p: any) => p._id === pid);
        setSelectedProduct(product);
        setProductId(pid);

        // Reset variants when product changes
        setVariants([
            {
                id: crypto.randomUUID(),
                size: "N/A",
                color: "N/A",
                sku: "",
                totalStock: 0,
                lowStockThreshold: 5,
                costPrice: 0,
            }
        ]);
    };

    const addVariantRow = () => {
        setVariants([
            ...variants,
            {
                id: crypto.randomUUID(),
                size: "N/A",
                color: "N/A",
                sku: "",
                totalStock: 0,
                lowStockThreshold: 5,
                costPrice: 0,
            }
        ]);
    };

    const removeVariantRow = (id: string) => {
        if (variants.length === 1) {
            showToast.error("You must have at least one variant");
            return;
        }
        setVariants(variants.filter(v => v.id !== id));
    };

    const updateVariant = (id: string, field: keyof VariantRow, value: any) => {
        setVariants(variants.map(v =>
            v.id === id ? { ...v, [field]: value } : v
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            showToast.error("Please select a product");
            return;
        }

        // Validate all variants have SKU
        const invalidVariants = variants.filter(v => !v.sku.trim());
        if (invalidVariants.length > 0) {
            showToast.error("All variants must have a SKU");
            return;
        }

        setSubmitting(true);
        try {
            // Create inventory records for all variants
            const promises = variants.map(variant =>
                InventoryService.create({
                    productId,
                    color: variant.color,
                    size: variant.size,
                    sku: variant.sku,
                    totalStock: variant.totalStock,
                    lowStockThreshold: variant.lowStockThreshold,
                    costPrice: variant.costPrice,
                    warehouseLocation: commonData.warehouseLocation,
                    aisle: commonData.aisle,
                    shelf: commonData.shelf,
                    supplier: commonData.supplier,
                })
            );

            await Promise.all(promises);
            showToast.success(`Successfully created ${variants.length} inventory record(s)`);
            router.push("/admin/inventory");
        } catch (err: any) {
            showToast.error(err.message || "Failed to create inventory");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Add Product Inventory</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Selection</CardTitle>
                        <CardDescription>Choose the product to create inventory records for.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Product *</Label>
                            <Select onValueChange={handleProductChange} value={productId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product: any) => (
                                        <SelectItem key={product._id} value={product._id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Variants Table */}
                {selectedProduct && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Product Variants</CardTitle>
                                <CardDescription>Add size and color combinations. Use "N/A" for products without variants.</CardDescription>
                            </div>
                            <Button type="button" onClick={addVariantRow} size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Variant
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium text-sm">Size</th>
                                            <th className="text-left p-2 font-medium text-sm">Color</th>
                                            <th className="text-left p-2 font-medium text-sm">SKU *</th>
                                            <th className="text-left p-2 font-medium text-sm">Stock</th>
                                            <th className="text-left p-2 font-medium text-sm">Low Stock Alert</th>
                                            <th className="text-left p-2 font-medium text-sm">Cost Price</th>
                                            <th className="text-left p-2 font-medium text-sm w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((variant, index) => (
                                            <tr key={variant.id} className="border-b">
                                                {/* Size */}
                                                <td className="p-2">
                                                    <Select
                                                        value={variant.size}
                                                        onValueChange={(val) => updateVariant(variant.id, 'size', val)}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="N/A">N/A</SelectItem>
                                                            {selectedProduct.sizes?.map((s: string) => (
                                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>

                                                {/* Color */}
                                                <td className="p-2">
                                                    <Select
                                                        value={variant.color}
                                                        onValueChange={(val) => updateVariant(variant.id, 'color', val)}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="N/A">N/A</SelectItem>
                                                            {selectedProduct.colors?.map((c: string) => (
                                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>

                                                {/* SKU */}
                                                <td className="p-2">
                                                    <Input
                                                        placeholder="SKU-001"
                                                        value={variant.sku}
                                                        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                                        className="w-40"
                                                        required
                                                    />
                                                </td>

                                                {/* Total Stock */}
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={variant.totalStock}
                                                        onChange={(e) => updateVariant(variant.id, 'totalStock', Number(e.target.value))}
                                                        className="w-24"
                                                    />
                                                </td>

                                                {/* Low Stock Threshold */}
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={variant.lowStockThreshold}
                                                        onChange={(e) => updateVariant(variant.id, 'lowStockThreshold', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </td>

                                                {/* Cost Price */}
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={variant.costPrice}
                                                        onChange={(e) => updateVariant(variant.id, 'costPrice', Number(e.target.value))}
                                                        className="w-32"
                                                    />
                                                </td>

                                                {/* Delete Button */}
                                                <td className="p-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeVariantRow(variant.id)}
                                                        disabled={variants.length === 1}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Common Warehouse Info */}
                {selectedProduct && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Warehouse Location (Common for all variants)</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Supplier</Label>
                                <Input
                                    placeholder="Supplier Name"
                                    value={commonData.supplier}
                                    onChange={(e) => setCommonData({ ...commonData, supplier: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location / Zone</Label>
                                <Input
                                    placeholder="Zone A"
                                    value={commonData.warehouseLocation}
                                    onChange={(e) => setCommonData({ ...commonData, warehouseLocation: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Aisle</Label>
                                <Input
                                    placeholder="Aisle 1"
                                    value={commonData.aisle}
                                    onChange={(e) => setCommonData({ ...commonData, aisle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Shelf</Label>
                                <Input
                                    placeholder="Shelf 3"
                                    value={commonData.shelf}
                                    onChange={(e) => setCommonData({ ...commonData, shelf: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting || !selectedProduct}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create {variants.length} Inventory Record{variants.length > 1 ? 's' : ''}
                    </Button>
                </div>
            </form>
        </div>
    );
}
