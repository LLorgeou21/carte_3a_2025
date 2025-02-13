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
        alert('Impossible de charger les données des villes.');
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
let cityMarkers = [];

loadCities().then(cities => {
    cities.forEach(city => {
        const marker = L.marker([city.lat, city.lng])
            .addTo(map)
            .bindPopup(`<b>${city.name}</b><br>En stage: ${city.residents ? city.residents.join(', ') : 'Aucun résident listé'}`);

        // Ouvrir la popup au clic
        marker.on('click', function() {
            marker.openPopup();
        });

        cityMarkers.push({
            name: city.name.toLowerCase(),
            residents: city.residents ? city.residents.map(resident => resident.toLowerCase()) : [],
            marker
        });
    });
});

// Fonction pour afficher/masquer le menu
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("open");
}
// Gestion de la recherche et centrage sur la ville trouvée
document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Vider les suggestions

    if (query.length > 2) {
        const filteredCities = cityMarkers.filter(city => 
            city.name.includes(query) || 
            city.residents.some(resident => resident.includes(query))
        );

        // Vérifier si la recherche correspond à un résident
        const isResidentSearch = filteredCities.some(city => 
            city.residents.some(resident => resident.includes(query))
        );

        filteredCities.forEach(city => {
            // Afficher la ville uniquement si la recherche correspond au nom de la ville
            if (!isResidentSearch && city.name.includes(query)) {
                const cityLi = document.createElement('li');
                cityLi.textContent = city.name.charAt(0).toUpperCase() + city.name.slice(1);
                cityLi.onclick = () => {
                    city.marker.openPopup();
                    map.setView(city.marker.getLatLng(), 10);
                    document.getElementById('search').value = city.name;
                    suggestions.innerHTML = ''; // Cacher les suggestions
                };
                suggestions.appendChild(cityLi);
            }

            // Afficher les résidents correspondants
            city.residents.forEach(resident => {
                if (resident.includes(query)) {
                    const residentLi = document.createElement('li');
                    residentLi.textContent = `${resident} (${city.name})`;
                    residentLi.onclick = () => {
                        city.marker.openPopup();
                        map.setView(city.marker.getLatLng(), 10);
                        document.getElementById('search').value = city.name;
                        suggestions.innerHTML = ''; // Cacher les suggestions
                    };
                    suggestions.appendChild(residentLi);
                }
            });
        });
    }
});