document.addEventListener("DOMContentLoaded", async () => {
    const cityName = getCityFromUrl();

    if (!cityName) {
        showError("Місто не вказане в URL.");
        return;
    }

    const cityData = await fetchCityData(cityName);

    if (!cityData) {
        showError("Не вдалося знайти інформацію про місто.");
        return;
    }

    displayCityData(cityData);
});

// Отримати місто з параметра в URL
function getCityFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("city");
}

// Отримати інформацію про місто через Nominatim API
async function fetchCityData(city) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${city}&addressdetails=1&accept-language=uk&countrycodes=UA`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "TopSpotsCityPage/1.0 (contact@topspots.com)"
            }
        });

        const data = await response.json();
        return data.length > 0 ? data[0] : null;

    } catch (error) {
        console.error("Помилка при завантаженні даних міста:", error);
        return null;
    }
}

// Вивід даних на сторінку
function displayCityData(data) {
    const name = data.display_name || "Без назви";
    const lat = data.lat;
    const lon = data.lon;
    const type = data.type || "місцевість";
    const details = data.address;

    // Назва міста
    document.getElementById("cityName").textContent =
        details.city || details.town || details.village || details.county || name;

    // Опис (примітивний на основі address)
    const description = `
        ${type === "city" ? "Місто" : "Місцевість"} в Україні, розташована в 
        ${details.region || details.state || "невідомому регіоні"}.
    `;
    document.getElementById("cityDescription").textContent = description;

    // Координати
    document.getElementById("coordinates").textContent = `Координати: ${lat}, ${lon}`;

    // Фото з Wikimedia (опційно)
    fetchCityPhoto(name);
}

// Показати повідомлення про помилку
function showError(message) {
    document.getElementById("cityName").textContent = "Помилка";
    document.getElementById("cityDescription").textContent = message;
    document.getElementById("coordinates").textContent = "";
}

// Підвантаження фото з Wikimedia
async function fetchCityPhoto(query) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(query)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        const pages = data.query.pages;
        const firstPage = Object.values(pages)[0];

        if (firstPage.original && firstPage.original.source) {
            document.getElementById("cityImage").src = firstPage.original.source;
            document.getElementById("cityImage").alt = query;
        } else {
            showNoImage();
        }
    } catch (err) {
        console.error("Не вдалося завантажити фото:", err);
        showNoImage();
    }
}

function showNoImage() {
    const img = document.getElementById("cityImage");
    img.src = "https://via.placeholder.com/600x400?text=Немає+фото";
    img.alt = "Фото недоступне";
}
