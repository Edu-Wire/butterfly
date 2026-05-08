import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const contentType = response.headers.get("content-type");
        const buffer = await response.arrayBuffer();

        res.set("Content-Type", contentType || "image/jpeg");
        res.set("Cache-Control", "public, max-age=3600");
        return res.send(Buffer.from(buffer));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch image" });
    }
});

export default router;
