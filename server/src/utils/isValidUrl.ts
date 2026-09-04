export function isValidUrl(value: String){
    if (typeof value !== 'string' || value.trim() === ''){
        return false;
    }

    let parsed;
    try {
        parsed = new URL(value);
    } catch (error) {
        return false; //not parseable
    }
   // Only allow http/https
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}