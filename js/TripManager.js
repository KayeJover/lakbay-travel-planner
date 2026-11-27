
const TRIPS_KEY = "lakbay-trips";

// Get all saved trips
export function getTrips() {
    return JSON.parse(localStorage.getItem(TRIPS_KEY)) || [];
}

// Create a new trip
export function addTrip(trip) {
    const trips = getTrips();

    const newTrip = {
        id: crypto.randomUUID(),
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        createdAt: new Date().toISOString()
    };

    trips.push(newTrip);

    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));

    return newTrip;
}

// Update an existing trip
export function updateTrip(id, updatedData) {
    const trips = getTrips();

    const updatedTrips = trips.map((trip) =>
        trip.id === id ? { ...trip, ...updatedData } : trip
    );

    localStorage.setItem(TRIPS_KEY, JSON.stringify(updatedTrips));
}

// Delete a trip
export function deleteTrip(id) {
    const trips = getTrips().filter((trip) => trip.id !== id);

    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

// Get a trip by ID
export function getTripById(id) {
    return getTrips().find((trip) => trip.id === id);
}
