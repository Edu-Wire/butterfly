
const API_BASE = "/api/inventory";

export const InventoryService = {
    // Get all items or filter
    async getAll({ productId, lowStock, status } = {}) {
        const params = new URLSearchParams();
        if (productId) params.append("productId", productId);
        if (lowStock) params.append("lowStock", "true");
        if (status) params.append("status", status);

        const res = await fetch(`${API_BASE}?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch inventory");
        return res.json();
    },

    // Get single item
    async getById(id) {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch inventory item");
        return res.json();
    },

    // Create new item
    async create(data) {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to create inventory item");
        }
        return res.json();
    },

    // Update item
    async update(id, data) {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update inventory item");
        return res.json();
    },

    // Delete item
    async delete(id) {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete inventory item");
        return res.json();
    },

    // Check stock
    async checkStock({ productId, color, size, quantity }) {
        const res = await fetch(`${API_BASE}/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, color, size, quantity }),
        });
        if (!res.ok) throw new Error("Failed to check stock");
        return res.json();
    },

    // Restock
    async restock(id, quantity, reason) {
        const res = await fetch(`${API_BASE}/${id}/restock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity, reason }),
        });
        if (!res.ok) throw new Error("Failed to restock");
        return res.json();
    },

    // Get Movements (History)
    async getHistory({ inventoryId, productId, type } = {}) {
        const params = new URLSearchParams();
        if (inventoryId) params.append("inventoryId", inventoryId);
        if (productId) params.append("productId", productId);
        if (type) params.append("type", type);

        const res = await fetch(`${API_BASE}/movements?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
    }
};
