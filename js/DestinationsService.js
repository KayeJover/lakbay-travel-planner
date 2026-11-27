const API_BASE_URL = "https://api.opentripmap.com/0.1/en/places";
const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;

export async function getDestinations(city) {
    try {
        // Get the city's coordinates
        const locationResponse = await fetch(
            `${API_BASE_URL}/geoname?name=${encodeURIComponent(city)}&apikey=${API_KEY}`
        );

        if (!locationResponse.ok) {
            throw new Error("Could not find the destination.");
        }

        const location = await locationResponse.json();

        // Find tourist attractions near the city
        const attractionsResponse = await fetch(
            `${API_BASE_URL}/radius?radius=10000&lon=${location.lon}&lat=${location.lat}&format=json&limit=20&apikey=${API_KEY}`
        );

        if (!attractionsResponse.ok) {
            throw new Error("Could not retrieve attractions.");
        }

        return await attractionsResponse.json();

    } catch (error) {
        console.error("Destination service error:", error);
        return [];
    }
}

export async function getDestinationDetails(xid) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/xid/${xid}?apikey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch destination details.");
        }

        return await response.json();
    } catch (error) {
        console.error("Destination details error:", error);
        return null;
    }
}