import { connectDB } from "../lib/db.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export class DashboardController {
    static async getStats(req, res) {
        try {
            await connectDB();

            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            const allOrders = await Order.find({}).sort({ createdAt: -1 });
            const currentMonthOrders = allOrders.filter((o) => new Date(o.createdAt) >= currentMonthStart);
            const previousMonthOrders = allOrders.filter(
                (o) => new Date(o.createdAt) >= previousMonthStart && new Date(o.createdAt) <= previousMonthEnd
            );

            const totalCustomers = await User.countDocuments({ role: "user" });
            const totalOrders = allOrders.length;
            const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            const previousMonthRevenue = previousMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

            const revenueChange =
                previousMonthRevenue > 0
                    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
                    : 0;
            const ordersChange =
                previousMonthOrders.length > 0
                    ? ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length * 100).toFixed(1)
                    : 0;

            // Top products
            const productSales = new Map();
            allOrders.forEach((order) => {
                order.items?.forEach((item) => {
                    const productId = item.productId?.toString();
                    if (productId) {
                        if (!productSales.has(productId)) {
                            productSales.set(productId, { name: item.name || "Unknown Product", sold: 0, revenue: 0 });
                        }
                        const sales = productSales.get(productId);
                        sales.sold += item.quantity || 1;
                        sales.revenue += (item.price || 0) * (item.quantity || 1);
                    }
                });
            });

            const products = await Product.find({ isActive: true }).limit(10);
            const productRatings = new Map();
            products.forEach((p) => {
                productRatings.set(p._id.toString(), { rating: p.rating || 0, reviews: p.reviewsCount || 0 });
            });

            const topProducts = Array.from(productSales.entries())
                .map(([productId, sales]) => {
                    const ratingData = productRatings.get(productId) || { rating: 0 };
                    return {
                        id: productId,
                        name: sales.name,
                        sold: sales.sold,
                        profit: `₹${(sales.revenue / 1000).toFixed(1)}K`,
                        review: ratingData.rating,
                    };
                })
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5);

            // Customer stats
            const activeCustomers = await User.countDocuments({ role: "user", isActive: true });
            const inactiveCustomers = totalCustomers - activeCustomers;
            const customerData =
                totalCustomers > 0
                    ? [
                          { name: "Active", value: activeCustomers, percentage: ((activeCustomers / totalCustomers) * 100).toFixed(1) },
                          { name: "Inactive", value: inactiveCustomers, percentage: ((inactiveCustomers / totalCustomers) * 100).toFixed(1) },
                      ]
                    : [
                          { name: "Active", value: 0, percentage: 0 },
                          { name: "Inactive", value: 0, percentage: 0 },
                      ];

            // Recent orders
            const recentOrders = allOrders.slice(0, 5).map((order) => ({
                id: order.orderId || order._id.toString(),
                customer: order.customer?.name || "Guest",
                amount: `₹${(order.total || 0).toLocaleString()}`,
                status: order.status || "Pending",
                date: order.createdAt,
            }));

            // Sales chart (last 6 months)
            const salesData = [];
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                const monthOrders = allOrders.filter((o) => {
                    const d = new Date(o.createdAt);
                    return d >= monthStart && d < monthEnd;
                });
                salesData.push({
                    month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    revenue: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
                    orders: monthOrders.length,
                });
            }

            // Geographic distribution
            const regionDistribution = new Map();
            allOrders.forEach((order) => {
                if (order.shipping?.country) {
                    const country = order.shipping.country.toLowerCase();
                    let region = "Others";
                    if (["china", "japan", "india", "singapore", "malaysia", "thailand", "indonesia", "philippines", "vietnam", "south korea", "hong kong", "taiwan"].includes(country)) region = "Asia";
                    else if (["united states", "canada", "mexico", "brazil", "argentina", "chile", "colombia", "peru"].includes(country)) region = "America";
                    else if (["united kingdom", "germany", "france", "italy", "spain", "netherlands", "belgium", "sweden", "norway", "denmark", "finland", "poland", "austria", "switzerland"].includes(country)) region = "Europe";
                    regionDistribution.set(region, (regionDistribution.get(region) || 0) + 1);
                }
            });

            const totalWithLocation = Array.from(regionDistribution.values()).reduce((s, c) => s + c, 0);
            const distributionData =
                totalWithLocation > 0
                    ? [
                          { name: "Asia", percentage: ((regionDistribution.get("Asia") || 0) / totalWithLocation * 100).toFixed(1), color: "bg-black" },
                          { name: "America", percentage: ((regionDistribution.get("America") || 0) / totalWithLocation * 100).toFixed(1), color: "bg-gray-600" },
                          { name: "Europe", percentage: ((regionDistribution.get("Europe") || 0) / totalWithLocation * 100).toFixed(1), color: "bg-gray-400" },
                          { name: "Others", percentage: ((regionDistribution.get("Others") || 0) / totalWithLocation * 100).toFixed(1), color: "bg-gray-300" },
                      ]
                    : [
                          { name: "Asia", percentage: "0.0", color: "bg-black" },
                          { name: "America", percentage: "0.0", color: "bg-gray-600" },
                          { name: "Europe", percentage: "0.0", color: "bg-gray-400" },
                          { name: "Others", percentage: "0.0", color: "bg-gray-300" },
                      ];

            return res.json({
                success: true,
                data: {
                    metrics: [
                        { title: "Customers", value: totalCustomers.toLocaleString(), change: parseFloat(8.3), changeText: "vs. previous month", icon: "users", color: "bg-gray-100 dark:bg-gray-800" },
                        { title: "Total Sales", value: `₹${totalRevenue.toLocaleString()}`, change: parseFloat(revenueChange), changeText: "vs. previous month", icon: "dollar", color: "bg-gray-100 dark:bg-gray-800" },
                        { title: "Total Orders", value: totalOrders.toLocaleString(), change: parseFloat(ordersChange), changeText: "vs. previous month", icon: "cart", color: "bg-gray-100 dark:bg-gray-800" },
                    ],
                    topProducts,
                    customerData,
                    recentOrders,
                    salesData,
                    distributionData,
                },
            });
        } catch (error) {
            console.error("[Dashboard] Stats error:", error);
            return res.status(500).json({ success: false, error: "Failed to fetch dashboard stats" });
        }
    }
}
