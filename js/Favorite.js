
const FAVORITES_KEY = "lakbay-favorites";

// Get saved favorites
export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

// Add a destination to favorites
export function addFavorite(destination) {
    const favorites = getFavorites();

    const alreadyExists = favorites.some(
        (favorite) => favorite.name === destination.name
    );

    if (!alreadyExists) {
        favorites.push(destination);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

// Remove a destination from favorites
export function removeFavorite(destinationName) {
    const favorites = getFavorites().filter(
        (favorite) => favorite.name !== destinationName
    );

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Check if a destination is already saved
export function isFavorite(destinationName) {
    return getFavorites().some(
        (favorite) => favorite.name === destinationName
    );
}
