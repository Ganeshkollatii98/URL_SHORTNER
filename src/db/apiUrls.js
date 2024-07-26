import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
    const { data, error } = await supabase.from('urls').select('*').eq('url_id', user_id);

    if (error) throw new Error('Unable to load URLs');
    return data;
}

export async function getUrl({ id, user_id }) {
    const { data, error } = await supabase.from('urls').select('*').eq('id', id).eq('url_id', user_id).single();

    if (error) throw new Error('Unable to load URLs');
    return data;
}
export async function deleteUrl(id) {
    const { data, error } = await supabase.from('urls').delete().eq('id', id);

    if (error) throw new Error('Unable to Delete url');
    return data;
}

export async function getLongUrl(id) {
    console.log(id)
    const { data, error } = await supabase.from('urls').select("id,original_url").or(`short_url.eq.${id},custom_url.eq.${id}`).single()

    if (error) throw new Error('Error fetching  short link');
    return data;
}




export async function createUrl({ title, longUrl, customUrl, url_id }, qrcode) {
    const short_url = Math.random().toString(36).substr(2, 6);
    const fileName = `qr-${short_url}`;

    const { error: storageError } = await supabase.storage
        .from("qr")
        .upload(fileName, qrcode);

    if (storageError) throw new Error(storageError.message);

    const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

    const { data, error } = await supabase
        .from("urls")
        .insert([
            {
                title,
                url_id,
                original_url: longUrl,
                custom_url: customUrl || null,
                short_url,
                qr,
            },
        ])
        .select();

    if (error) {
        console.error(error);
        throw new Error("Error creating short URL");
    }

    return data;
}

