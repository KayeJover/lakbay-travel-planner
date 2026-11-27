
import { getDestinations } from "./DestinationsService.js";

import {
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
} from "./Favorite.js";
import {
    getTrips,
    addTrip,
    deleteTrip
} from "./TripManager.js";
import {
    getItinerary,
    addActivity,
    updateActivity,
    deleteActivity
} from "./Itinerary.js";
import { getCurrentWeather } from "./WeatherService.js";

// Local destination image mapping
const destinationImages = [
    { keywords: ["basilica", "santo nino", "sto nino"], image: "basilica-santo-nino.jpg" },
    { keywords: ["cebu provincial capitol"], image: "cebu-capitol.jpg" },
    { keywords: ["heritage monument"], image: "cebu-heritage-monument.jpg" },
    { keywords: ["fort san pedro"], image: "fort-san-pedro.jpg" },
    { keywords: ["kawasan"], image: "kawasan-falls.jpg" },
    { keywords: ["mactan shrine", "lapulapu"], image: "mactan-shrine.jpg" },
    { keywords: ["magellan"], image: "magellan-cross.jpg" },
    { keywords: ["moalboal"], image: "moalboal.jpg" },
    { keywords: ["oslob"], image: "oslob-cebu.jpg" },
    { keywords: ["osmena"], image: "osmena-peak.jpg" },
    { keywords: ["sirao"], image: "sirao-flower-garden.jpg" },
    { keywords: ["sumilon"], image: "sumilon-island.jpg" },
    { keywords: ["taoist"], image: "taoist-temple.jpg" },
    { keywords: ["temple of leah"], image: "temple-of-leah.jpg" },
    { keywords: ["tops lookout", "tops"], image: "tops-lookout.jpg" }
];

// Featured Cebu destinations
const featuredDestinations = [
    { name: "Basilica del Santo Niño", image: "basilica-santo-nino.jpg", description: "Historic church and cultural landmark." },
    { name: "Cebu Provincial Capitol", image: "cebu-capitol.jpg", description: "A beautiful historic government building." },
    { name: "Cebu Heritage Monument", image: "cebu-heritage-monument.jpg", description: "Discover Cebu's rich history." },
    { name: "Fort San Pedro", image: "fort-san-pedro.jpg", description: "Explore a historic Spanish-era fort." },
    { name: "Kawasan Falls", image: "kawasan-falls.jpg", description: "Enjoy beautiful turquoise waterfalls." },
    { name: "Mactan Shrine", image: "mactan-shrine.jpg", description: "Visit an important Cebu historical site." },
    { name: "Magellan's Cross", image: "magellan-cross.jpg", description: "Explore one of Cebu's famous landmarks." },
    { name: "Moalboal", image: "moalboal.jpg", description: "Discover Cebu's beautiful coastal waters." },
    { name: "Oslob", image: "oslob-cebu.jpg", description: "Explore the attractions of southern Cebu." },
    { name: "Osmeña Peak", image: "osmena-peak.jpg", description: "Enjoy scenic mountain views." },
    { name: "Sirao Flower Garden", image: "sirao-flower-garden.jpg", description: "Experience Cebu's colorful flower gardens." },
    { name: "Sumilon Island", image: "sumilon-island.jpg", description: "Discover a beautiful island paradise." },
    { name: "Cebu Taoist Temple", image: "taoist-temple.jpg", description: "Visit a beautiful temple overlooking Cebu." },
    { name: "Temple of Leah", image: "temple-of-leah.jpg", description: "Explore Cebu's grand architectural landmark." },
    { name: "Tops Lookout", image: "tops-lookout.jpg", description: "Enjoy panoramic views of Cebu City." }
];

// Format attraction categories
function formatCategories(kinds) {
    if (!kinds) {
        return "Explore this attraction in Cebu.";
    }

    return kinds
        .split(",")
        .slice(0, 3)
        .map((kind) =>
            kind
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())
        )
        .join(" • ");
}

// Find a matching local image
function findDestinationImage(placeName) {
    const normalizedName = placeName.toLowerCase();

    return destinationImages.find((destination) =>
        destination.keywords.some((keyword) =>
            normalizedName.includes(keyword)
        )
    );
}

// Create a destination image with fallback
function createDestinationImage(src, name) {
    const image = document.createElement("img");

    image.src = src;
    image.alt = name;
    image.loading = "lazy";
    image.classList.add("destination-image");

    image.onerror = () => {
        image.onerror = null;
        image.src = "./images/destination-placeholder.jpg";
    };

    return image;
}

// Create a favorite button
function createFavoriteButton(destination) {
    const button = document.createElement("button");
    button.classList.add("favorite-button");
    button.dataset.destination = destination.name;
    button.type = "button";

    function updateButton() {
        const saved = isFavorite(destination.name);

        button.textContent = saved
            ? "♥ Saved"
            : "♡ Add to Favorites";

        button.setAttribute("aria-pressed", saved);
    }

    updateButton();

    button.addEventListener("click", () => {
        if (isFavorite(destination.name)) {
            removeFavorite(destination.name);
        } else {
            addFavorite(destination);
        }

        updateButton();
        displayFavorites();
    });

    return button;
}

// Display saved favorites
function displayFavorites() {
    const favoriteList = document.getElementById("favorite-list");

    if (!favoriteList) return;

    favoriteList.innerHTML = "";

    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoriteList.innerHTML = "<p>No favorites saved yet.</p>";
        return;
    }

    favorites.forEach((destination) => {
        const card = document.createElement("article");
        card.classList.add("destination-card");

        const image = createDestinationImage(
            destination.image,
            destination.name
        );

        const title = document.createElement("h3");
        title.textContent = destination.name;

        const description = document.createElement("p");
        description.textContent = destination.description || "";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "♥ Remove";

        removeButton.addEventListener("click", () => {
            removeFavorite(destination.name);
            displayFavorites();
            updateFavoriteButtons();
        });

        card.append(image, title, description, removeButton);
        favoriteList.appendChild(card);
    });
}

// Update all favorite buttons
function updateFavoriteButtons() {
    document.querySelectorAll(".favorite-button").forEach((button) => {
        const name = button.dataset.destination;

        if (!name) return;

        const saved = isFavorite(name);

        button.textContent = saved
            ? "♥ Saved"
            : "♡ Add to Favorites";

        button.setAttribute("aria-pressed", saved);
    });
}

// Filter destination cards
function setupDestinationSearch(destinationList) {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("destination-search");

    if (!searchInput) return;

    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
        });
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        const cards = destinationList.querySelectorAll(".destination-card");
        let visibleCount = 0;

        cards.forEach((card) => {
            const destinationName =
                card.querySelector("h3")?.textContent.toLowerCase() || "";

            const matches = destinationName.includes(searchTerm);

            card.style.display = matches ? "" : "none";

            if (matches) visibleCount++;
        });

        destinationList
            .querySelectorAll(".destination-group-title")
            .forEach((heading) => {
                heading.style.display = visibleCount > 0 ? "" : "none";
            });

        let noResults = document.getElementById("search-no-results");

        if (!noResults) {
            noResults = document.createElement("p");
            noResults.id = "search-no-results";
            destinationList.appendChild(noResults);
        }

        noResults.textContent =
            visibleCount === 0
                ? "No destinations found. Try another search."
                : "";

        noResults.style.display =
            visibleCount === 0 ? "" : "none";
    });
}


function displayTrips() {
    const tripList = document.getElementById("upcoming-trips");

    if (!tripList) return;

    tripList.innerHTML = "";

    const trips = getTrips();

    if (trips.length === 0) {
        tripList.innerHTML = "<p>No trips planned yet. Start planning your next adventure!</p>";
        return;
    }

    trips.forEach((trip) => {
        const card = document.createElement("article");
        card.classList.add("trip-card");

        const title = document.createElement("h3");
        title.textContent = trip.name;

        const destination = document.createElement("p");
        destination.textContent = `📍 ${trip.destination}`;

        const dates = document.createElement("p");
        dates.textContent = `📅 ${trip.startDate} to ${trip.endDate}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Trip";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(`Delete "${trip.name}"?`);

            if (confirmed) {
                deleteTrip(trip.id);
                displayTrips();
            }
        });
        const itineraryContainer = document.createElement("div");
        itineraryContainer.classList.add("itinerary-container");

        const itineraryButton = document.createElement("button");
        itineraryButton.type = "button";
        itineraryButton.textContent = "View Itinerary";

        itineraryButton.addEventListener("click", () => {
            displayItinerary(trip.id, itineraryContainer);
        });

        card.append(itineraryButton, itineraryContainer);

        card.append(title, destination, dates, deleteButton);
        tripList.appendChild(card);
    });
}

function setupTripCreation() {
    const createTripButton = document.getElementById("create-trip-button");

    if (!createTripButton) return;

    createTripButton.addEventListener("click", () => {
        const name = prompt("Enter your trip name:");

        if (!name || !name.trim()) return;

        const destination = prompt("Where are you going?");

        if (!destination || !destination.trim()) return;

        const startDate = prompt("Enter your start date (YYYY-MM-DD):");

        if (!startDate) return;

        const endDate = prompt("Enter your end date (YYYY-MM-DD):");

        if (!endDate) return;

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
            Number.isNaN(Date.parse(startDate)) ||
            Number.isNaN(Date.parse(endDate))
        ) {
            alert("Please enter valid dates using YYYY-MM-DD.");
            return;
        }

        if (endDate < startDate) {
            alert("The end date cannot be earlier than the start date.");
            return;
        }

        addTrip({
            name: name.trim(),
            destination: destination.trim(),
            startDate,
            endDate
        });

        displayTrips();

        alert("Your trip has been created successfully!");
    });
}

function displayItinerary(tripId, container) {
    container.innerHTML = "";

    const heading = document.createElement("h4");
    heading.textContent = "Trip Itinerary";

    const activities = getItinerary(tripId);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "+ Add Activity";

    addButton.addEventListener("click", () => {
        const name = prompt("Activity name:");
        if (!name || !name.trim()) return;

        const date = prompt("Activity date (YYYY-MM-DD):");
        if (!date) return;

        const time = prompt("Activity time (e.g. 09:00 AM):");
        if (!time) return;

        const location = prompt("Activity location:");
        if (!location || !location.trim()) return;

        addActivity(tripId, {
            name: name.trim(),
            date,
            time,
            location: location.trim()
        });

        displayItinerary(tripId, container);
    });

    container.append(heading, addButton);

    if (activities.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No activities planned yet.";
        container.appendChild(message);
        return;
    }

    activities
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach((activity) => {
            const item = document.createElement("div");
            item.classList.add("itinerary-item");

            const title = document.createElement("h5");
            title.textContent = activity.name;

            const details = document.createElement("p");
            details.textContent =
                `${activity.date} | ${activity.time} | ${activity.location}`;

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", () => {
                const name = prompt("Activity name:", activity.name);
                if (!name || !name.trim()) return;

                const date = prompt("Activity date:", activity.date);
                if (!date) return;

                const time = prompt("Activity time:", activity.time);
                if (!time) return;

                const location = prompt(
                    "Activity location:",
                    activity.location
                );

                if (!location || !location.trim()) return;

                updateActivity(tripId, activity.id, {
                    name: name.trim(),
                    date,
                    time,
                    location: location.trim()
                });

                displayItinerary(tripId, container);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteActivity(tripId, activity.id);
                displayItinerary(tripId, container);
            });

            item.append(title, details, editButton, deleteButton);
            container.appendChild(item);
        });
}


async function displayWeather(location = "Cebu") {
    const weatherContainer = document.getElementById("weather-overview");

    if (!weatherContainer) return;

    weatherContainer.innerHTML = "<p>Loading weather information...</p>";

    try {
        const weather = await getCurrentWeather(location);

        const { current, location: weatherLocation } = weather;

        weatherContainer.innerHTML = "";

        // Weather heading
        const heading = document.createElement("h3");
        heading.textContent = `Weather in ${weatherLocation.name}`;

        // Main weather content
        const content = document.createElement("div");
        content.classList.add("weather-content");

        // Weather icon
        const icon = document.createElement("img");
        icon.src = `https:${current.condition.icon}`;
        icon.alt = current.condition.text;
        icon.classList.add("weather-icon");

        // Temperature and condition
        const mainWeather = document.createElement("div");
        mainWeather.classList.add("weather-main");

        const weatherInfo = document.createElement("div");

        const temperature = document.createElement("div");
        temperature.classList.add("weather-temperature");
        temperature.textContent = `${current.temp_c}°C`;

        const condition = document.createElement("p");
        condition.classList.add("weather-condition");
        condition.textContent = current.condition.text;

        weatherInfo.append(temperature, condition);
        mainWeather.append(icon, weatherInfo);

        // Weather details
        const details = document.createElement("div");
        details.classList.add("weather-details");

        const weatherDetails = [
            {
                label: "Feels Like",
                value: `${current.feelslike_c}°C`
            },
            {
                label: "Humidity",
                value: `${current.humidity}%`
            },
            {
                label: "Wind",
                value: `${current.wind_kph} km/h`
            }
        ];

        weatherDetails.forEach((detail) => {
            const item = document.createElement("div");
            item.classList.add("weather-detail");

            const label = document.createElement("span");
            label.textContent = detail.label;

            const value = document.createElement("span");
            value.textContent = detail.value;

            item.append(label, value);
            details.appendChild(item);
        });

        content.append(mainWeather, details);

        weatherContainer.append(heading, content);

    } catch (error) {
        console.error("Weather error:", error);

        weatherContainer.innerHTML =
            "<p>Unable to load weather information. Please try again later.</p>";
    }
}



document.addEventListener("DOMContentLoaded", async () => {
    console.log("Lakbay Travel Planner initialized!");

    // Display current year
    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Display existing favorites
    displayFavorites();

    // Display saved trips
    displayTrips();
    setupTripCreation();
    displayWeather("Cebu");

    // Get destination container
    const destinationList = document.getElementById("destination-list");

    if (!destinationList) {
        console.error("Destination list element not found.");
        return;
    }

    // Set up destination search
    setupDestinationSearch(destinationList);

    // Display featured destinations
    function displayFeaturedDestinations() {
        const heading = document.createElement("h3");
        heading.classList.add("destination-group-title");
        heading.textContent = "Featured Cebu Destinations";

        destinationList.appendChild(heading);

        featuredDestinations.forEach((destination) => {
            const card = document.createElement("article");
            card.classList.add("destination-card");

            const image = createDestinationImage(
                `./images/${destination.image}`,
                destination.name
            );

            const title = document.createElement("h3");
            title.textContent = destination.name;

            const description = document.createElement("p");
            description.textContent = destination.description;

            const favoriteButton = createFavoriteButton({
                name: destination.name,
                image: `./images/${destination.image}`,
                description: destination.description
            });

            card.append(image, title, description, favoriteButton);
            destinationList.appendChild(card);
        });
    }

    // Display OpenTripMap attractions
    function displayApiDestination(place) {
        const card = document.createElement("article");
        card.classList.add("destination-card");

        const matchedImage = findDestinationImage(place.name);

        const imagePath = matchedImage
            ? `./images/${matchedImage.image}`
            : "./images/destination-placeholder.jpg";

        const image = createDestinationImage(
            imagePath,
            place.name
        );

        const title = document.createElement("h3");
        title.textContent = place.name;

        const descriptionText = formatCategories(place.kinds);

        const description = document.createElement("p");
        description.textContent = descriptionText;

        const favoriteButton = createFavoriteButton({
            name: place.name,
            image: imagePath,
            description: descriptionText
        });

        card.append(image, title, description, favoriteButton);
        destinationList.appendChild(card);
    }

    // Load destinations
    destinationList.innerHTML = "<p>Loading destinations...</p>";

    try {
        const destinations = await getDestinations("Cebu");

        const places = destinations.filter((place) => place.name);

        destinationList.innerHTML = "";

        // Show featured destinations first
        displayFeaturedDestinations();

        // Add API attractions heading
        const apiHeading = document.createElement("h3");
        apiHeading.classList.add("destination-group-title");
        apiHeading.textContent = "More Attractions to Explore";

        destinationList.appendChild(apiHeading);

        if (places.length === 0) {
            const message = document.createElement("p");
            message.textContent =
                "No additional attractions found right now.";

            destinationList.appendChild(message);
        } else {
            places.forEach(displayApiDestination);
        }

        console.log(
            `${featuredDestinations.length} featured destinations and ${places.length} API attractions displayed.`
        );

    } catch (error) {
        console.error("Unable to load destinations:", error);

        destinationList.innerHTML = "";

        // Keep featured destinations visible if the API fails
        displayFeaturedDestinations();

        const message = document.createElement("p");
        message.textContent =
            "Unable to load additional attractions right now.";

        destinationList.appendChild(message);
    }
});
