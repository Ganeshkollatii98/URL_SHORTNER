import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

const IPAPI_API_KEY = "a5d20b40dc96fea762c5f3bc242eb092b80008ae98adb8520a4d4af9"


export async function getClicksForUrls(urlIds) {
    console.log("api", urlIds)
    const { data, error } = await supabase.from('clicks').select('*').in('url_id', urlIds);

    if (error) throw new Error('Unable to load Clicks');
    return data;
}


export async function getClicksForUrl(url_id) {
    const { data, error } = await supabase.from('clicks').select('*').eq('url_id', url_id);

    if (error) throw new Error('Unable to load stats');
    return data;
}
const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
    try {
        const res = parser.getResult();
        const device = res.type || "desktop"; // Default to desktop if type is not detected

        const response = await fetch(`https://api.ipdata.co/8.8.8.8?api-key=${IPAPI_API_KEY}`);
        const { city, country_name: country } = await response.json();

        // Record the click
        await supabase.from("clicks").insert({
            url_id: id,
            city: city,
            country: country,
            device: device,
        });

        // Redirect to the original URL
        window.location.href = originalUrl;
    } catch (error) {
        console.error("Error recording click:", error);
    }
};

