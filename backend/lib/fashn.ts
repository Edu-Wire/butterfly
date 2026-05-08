
export interface FashnTryOnParams {
    model_image: string;
    garment_image: string;
    category: 'tops' | 'bottoms' | 'one-pieces';
    cover_feet?: boolean;
}

export interface FashnResponse {
    id: string;
    status: 'starting' | 'processing' | 'completed' | 'failed' | 'cancelled';
    output?: string[];
    error?: string;
}

const FASHN_API_URL = 'https://api.fashn.ai/v1';


export async function createTryOn(params: FashnTryOnParams): Promise<FashnResponse> {
    const apiKey = process.env.FASHN_API_KEY;
    if (!apiKey) {
        throw new Error('FASHN_API_KEY is not configured');
    }

    const response = await fetch(`${FASHN_API_URL}/run`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model_name: "tryon-v1.6",
            inputs: {
                model_image: params.model_image,
                garment_image: params.garment_image,
                category: params.category,
            }
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to start try-on generation');
    }

    return data;
}


export async function getTryOnStatus(id: string): Promise<FashnResponse> {
    const apiKey = process.env.FASHN_API_KEY;
    if (!apiKey) {
        throw new Error('FASHN_API_KEY is not configured');
    }

    const response = await fetch(`${FASHN_API_URL}/status/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to get try-on status');
    }

    return data;
}
