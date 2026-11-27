
const ITINERARY_KEY = "lakbay-itineraries";

// Get all saved itinerary activities
export function getItinerary(tripId) {
    const itineraries = JSON.parse(
        localStorage.getItem(ITINERARY_KEY)
    ) || {};

    return itineraries[tripId] || [];
}

// Add an activity to a trip
export function addActivity(tripId, activity) {
    const itineraries = JSON.parse(
        localStorage.getItem(ITINERARY_KEY)
    ) || {};

    const newActivity = {
        id: crypto.randomUUID(),
        name: activity.name,
        date: activity.date,
        time: activity.time,
        location: activity.location,
        description: activity.description || ""
    };

    if (!itineraries[tripId]) {
        itineraries[tripId] = [];
    }

    itineraries[tripId].push(newActivity);

    localStorage.setItem(
        ITINERARY_KEY,
        JSON.stringify(itineraries)
    );

    return newActivity;
}

// Update an existing activity
export function updateActivity(tripId, activityId, updatedData) {
    const activities = getItinerary(tripId);

    const updatedActivities = activities.map((activity) =>
        activity.id === activityId
            ? { ...activity, ...updatedData }
            : activity
    );

    saveItinerary(tripId, updatedActivities);
}

// Delete an activity
export function deleteActivity(tripId, activityId) {
    const activities = getItinerary(tripId);

    const updatedActivities = activities.filter(
        (activity) => activity.id !== activityId
    );

    saveItinerary(tripId, updatedActivities);
}

// Save itinerary activities
function saveItinerary(tripId, activities) {
    const itineraries = JSON.parse(
        localStorage.getItem(ITINERARY_KEY)
    ) || {};

    itineraries[tripId] = activities;

    localStorage.setItem(
        ITINERARY_KEY,
        JSON.stringify(itineraries)
    );
}
