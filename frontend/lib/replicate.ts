
import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export interface TryOnParams {
    human_img: string
    garm_img: string
    garment_des: string
    category?: string
}


// IDM-VTON model identifier
const MODEL_OWNER = "cuuupid";
const MODEL_NAME = "idm-vton";

export async function createTryOnPrediction(params: TryOnParams) {
    if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error('REPLICATE_API_TOKEN is not configured')
    }

    // Fetch the latest version dynamically
    const model = await replicate.models.get(MODEL_OWNER, MODEL_NAME);
    const version = model.latest_version?.id;

    if (!version) {
        throw new Error(`Could not find latest version for model ${MODEL_OWNER}/${MODEL_NAME}`);
    }

    const prediction = await replicate.predictions.create({
        version: version,
        input: {
            human_img: params.human_img,
            garm_img: params.garm_img,
            garment_des: params.garment_des || "garment",
            crop: false,
            seed: 42,
            steps: 30,
            category: params.category || "upper_body"
        }
    })

    return prediction;
}


export async function getTryOnPredictionStatus(id: string) {
    if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error('REPLICATE_API_TOKEN is not configured')
    }

    const prediction = await replicate.predictions.get(id);
    return prediction;
}
