import { Client } from "@gradio/client";

async function inspect() {
    console.log("Connecting to yisol/IDM-VTON...");
    try {
        const client = await Client.connect("yisol/IDM-VTON");
        console.log("Connected!");
        const info = await client.view_api();
        console.log("API Info:");
        console.log(JSON.stringify(info, null, 2));
    } catch (error) {
        console.error("Error connecting to Gradio space:", error);
    }
}

inspect();
