// Fonction pour charger les données JSON
async function loadCities() {
    try {
        const response = await fetch('cities.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données des villes');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Initialiser la carte centrée sur la France
const map = L.map('map').setView([46.603354, 1.888334], 6);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Charger les villes et ajouter des marqueurs
loadCities().then(cities => {
    cities.forEach(city => {
        const marker = L.marker([city.lat, city.lng])
            .addTo(map)
            .bindPopup(`<b>${city.name}</b><br>En stage: ${city.residents ? city.residents.join(', ') : 'Aucun résident listé'}`);

        // Ouvrir la popup au clic
        marker.on('click', function () {
            marker.openPopup();
        });
    });
});
