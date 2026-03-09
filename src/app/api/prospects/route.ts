import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!query || !location) {
    return NextResponse.json({ error: "Query and location are required" }, { status: 400 });
  }

  // If no API key, return sophisticated mock data based on query for demonstration
  if (!apiKey || apiKey === "your_api_key_here") {
    console.warn("GOOGLE_MAPS_API_KEY is missing or default. Returning simulated data.");
    
    const mockCategories = ["Restaurant", "Plumber", "Dentist", "Bakery", "Gym", "Electrician", "Cafe"];
    const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    
    const simulatedData = Array.from({ length: 6 }).map((_, i) => ({
      id: `sim-${Date.now()}-${i}`,
      name: `${location} ${query} ${i + 1}`,
      rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10,
      address: `${Math.floor(Math.random() * 999)} ${location} Blvd, ${location}`,
      phone: `(555) ${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 8999) + 1000}`,
      website: Math.random() > 0.7 ? `https://example-${i}.com` : null, // 70% chance of no website
      category: query || randomCategory,
      photos: []
    }));

    return NextResponse.json({ results: simulatedData, isSimulated: true });
  }

  try {
    // 1. Text Search to find businesses
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(`${query} in ${location}`)}&key=${apiKey}`;
    console.log("Fetching search results from:", searchUrl.replace(apiKey, "REDACTED"));
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    console.log("Search API Status:", searchData.status);

    if (searchData.status !== "OK") {
      if (searchData.status === "ZERO_RESULTS") {
        return NextResponse.json({ results: [], isSimulated: false });
      }
      return NextResponse.json({ 
        error: searchData.error_message || `Search failed with status: ${searchData.status}. Make sure "Places API" is enabled in Google Cloud Console.` 
      }, { status: 500 });
    }

    // 2. Fetch details for each business (to get the website)
    const resultsWithDetails = await Promise.all(
      searchData.results.slice(0, 10).map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,formatted_address,formatted_phone_number,website,user_ratings_total,types&key=${apiKey}`;
        
        try {
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          const details = detailsData.result || {};

          return {
            id: place.place_id,
            name: details.name || place.name,
            rating: details.rating || place.rating || 0,
            reviews: details.user_ratings_total || place.user_ratings_total || 0,
            address: details.formatted_address || place.formatted_address,
            phone: details.formatted_phone_number || "N/A",
            website: details.website || null,
            category: details.types ? details.types[0].replace(/_/g, " ") : "Business"
          };
        } catch (e) {
          console.error(`Error fetching details for ${place.place_id}:`, e);
          return {
            id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            reviews: place.user_ratings_total || 0,
            address: place.formatted_address,
            phone: "N/A",
            website: null,
            category: "Business"
          };
        }
      })
    );

    return NextResponse.json({ results: resultsWithDetails, isSimulated: false });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch from Google Maps" }, { status: 500 });
  }
}
