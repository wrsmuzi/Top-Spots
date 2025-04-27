console.log("city_page.js запустився!");

const params = new URLSearchParams(window.location.search);
const placeName = params.get('city');

document.getElementById('place-name').textContent = placeName;

// 1. Отримати опис через Nominatim
async function fetchDescription() {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${placeName}&accept-language=uk`);
  const data = await response.json();
  if (data.length > 0) {
    document.getElementById('description').textContent = data[0].display_name;
    const { lat, lon } = data[0];
    initMap(lat, lon);
    fetchPhotos(lat, lon);
    fetchReviews();
  }
}
fetchDescription();

// 2. Ініціалізація карти
function initMap(lat, lon) {
  const map = L.map('map').setView([lat, lon], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup(placeName).openPopup();
}

// 3. Фото через Mapillary
async function fetchPhotos(lat, lon) {
  const container = document.getElementById('photos');
  container.innerHTML = '<p>Завантаження фото...</p>';

  try {
    const response = await fetch(`https://graph.mapillary.com/image_search?access_tokenMLY|909968983680275386b0ddbe25156d7d3c69613775150c1b&fields=id,thumb_1024_url&closeto=${lon},${lat}&radius=25000&limit=6`);
    const data = await response.json();
    container.innerHTML = '';

    if (data.data && data.data.length > 0) {
      data.data.forEach(img => {
        const image = document.createElement('img');
        image.src = img.thumb_1024_url;
        container.appendChild(image);
      });
    } else {
      container.innerHTML = '<p>Фото не знайдено 😢</p>';
    }
  } catch (error) {
    console.error('Помилка при завантаженні фото:', error);
    container.innerHTML = '<p>Фото не вдалося завантажити 😔</p>';
  }
}

// 4. Відгуки
async function fetchReviews() {
  const response = await fetch(`/api/reviews?place=${encodeURIComponent(placeName)}`);
  const data = await response.json();
  const container = document.getElementById('reviews');

  if (data.length === 0) {
    container.innerHTML = "<p>Поки немає відгуків. Будьте першим!</p>";
  } else {
    data.forEach(review => {
      const div = document.createElement('div');
      div.className = 'review';
      div.innerHTML = `<strong>${review.user_name}</strong> — ${'★'.repeat(review.rating)}<br>${review.comment}`;
      container.appendChild(div);
    });
  }
}

// 5. Відправка нового відгуку
document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userName = document.getElementById('user-name').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ place_name: placeName, user_name: userName, rating: Number(rating), comment })
  });

  location.reload();
});
