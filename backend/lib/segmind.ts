
export interface SegmindTryOnParams {
    model_image: string;
    garment_image: string;
    category: 'upper_body' | 'lower_body' | 'dresses';
    seed?: number;
    steps?: number;
}

const SEGMIND_API_URL = "https://api.segmind.com/v1/idm-vton";

export async function createSegmindTryOn(params: SegmindTryOnParams) {
    if (!process.env.SEGMIND_API_KEY) {
        throw new Error('SEGMIND_API_KEY is not configured');
    }

    const payload = {
        category: params.category,
        garment_img: params.garment_image,
        human_img: params.model_image,
        garment_des: params.category, // Using category as description
        seed: params.seed || 42,
        steps: params.steps || 30
    };

    const response = await fetch(SEGMIND_API_URL, {
        method: "POST",
        headers: {
            "x-api-key": process.env.SEGMIND_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Segmind API error: ${response.status} ${errorText}`);
    }

    // Segmind usually returns the image data directly (blob or base64)
    // or a JSON with "image" property which is base64 encoded
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // Assume data.image is base64
        if (data.image) {
            return `data:image/png;base64,${data.image}`;
        }
        return data;
    } else {
        // Direct image return
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    }
}
