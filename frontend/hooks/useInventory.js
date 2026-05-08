
import useSWR, { mutate } from "swr";
import { InventoryService } from "../lib/inventoryService";

// SWR fetcher wrapper
const fetcher = (url) => fetch(url).then((res) => res.json());

export function useInventory(params = {}) {
    // Construct query string for SWR key
    const queryParams = new URLSearchParams();
    if (params.productId) queryParams.append("productId", params.productId);
    if (params.lowStock) queryParams.append("lowStock", "true");
    if (params.status) queryParams.append("status", params.status);

    const key = `/api/inventory?${queryParams.toString()}`;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
        refreshInterval: 5000, // Auto-refresh every 5 seconds for dynamic updates
    });

    return {
        inventory: data,
        isLoading,
        isError: error,
        mutate, // Expose mutate to refresh data manually
    };
}

export function useInventoryItem(id) {
    const { data, error, isLoading, mutate } = useSWR(id ? `/api/inventory/${id}` : null, fetcher);

    return {
        item: data,
        isLoading,
        isError: error,
        mutate, // For refreshing single item
    };
}

export function useInventoryHistory(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.inventoryId) queryParams.append("inventoryId", params.inventoryId);
    if (params.productId) queryParams.append("productId", params.productId);
    if (params.type) queryParams.append("type", params.type);

    const key = `/api/inventory/movements?${queryParams.toString()}`;
    const { data, error, isLoading } = useSWR(key, fetcher);

    return {
        movements: data,
        isLoading,
        isError: error
    }
}
