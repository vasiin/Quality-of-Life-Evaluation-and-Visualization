mapboxgl.accessToken = 'pk.eyJ1IjoiYnJvb2sxMjM0IiwiYSI6ImNsbWhyMXJkajA3NDkzZnFzZXV6YW5lZ3QifQ.DxTQHB79qDgP4XTX_GbpKA'; // Replace with your Mapbox access token
 // Replace with your Mapbox access token

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [100.60766, 14.06938],
    zoom: 10,
    pitch: 60,
    bearing: -60,
    antialias: true
});

let startPoint = null;
let endPoint = null;
let totalDistance = 0;
let totalTime = 0;
let colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF8C33'];
let currentColorIndex = 0;
let segmentsData = [];
let segmentHeaders = [];

const transportationTypes = ['driving-traffic', 'cycling', 'walking'];

map.on('load', function() {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
        }
    });
});

function geocodeDestination(query, callback) {
    const geocodingAPI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;

    fetch(geocodingAPI)
        .then(response => response.json())
        .then(data => {
            if (data && data.features && data.features.length) {
                callback(data.features);
            } else {
                callback([]);
            }
        })
        .catch(error => {
            console.error("Error fetching geocoding data:", error);
            callback([]);
        });
}

function fetchRoute(start, end, type, callback) {
    const directionsAPI = `https://api.mapbox.com/directions/v5/mapbox/${type}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(directionsAPI)
        .then(response => response.json())
        .then(data => {
            if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
                const routeCoordinates = data.routes[0].geometry.coordinates;
                const distance = data.routes[0].distance / 1000;
                const duration = data.routes[0].duration / 60;
                callback(routeCoordinates, distance, duration);
            } else {
                callback(null, 0, 0);
            }
        })
        .catch(error => {
            console.error("Error fetching route:", error);
            callback(null, 0, 0);
        });
}


function updateTransportationTable() {
    const tbody = document.querySelector('#transportationTable tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    transportationTypes.forEach(type => {
        const row = document.createElement('tr');
        row.id = `${type}Row`;

        const header = document.createElement('td');
        header.textContent = type;
        row.appendChild(header);

        segmentsData.forEach(segment => {
            const cell = document.createElement('td');
            if (type === 'driving-traffic') {
                cell.textContent = `${segment.distance} km, ${segment.time} mins`;
            } else {
                fetchRoute(segment.start, segment.end, type, function(_, distance, duration) {
                    cell.textContent = `${distance.toFixed(2)} km, ${duration.toFixed(2)} mins`;
                });
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}



document.getElementById('addDestination').addEventListener('click', function() {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'inputWrapper';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'destinationInput';
    newInput.placeholder = 'Type a destination...';
    inputWrapper.appendChild(newInput);

    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'suggestions';
    inputWrapper.appendChild(suggestionsBox);

    document.getElementById('destinationInputs').appendChild(inputWrapper);
});

document.getElementById('destinationInputs').addEventListener('input', function(e) {
    if (e.target && e.target.className === 'destinationInput') {
        const query = e.target.value;
        const suggestionsBox = e.target.nextElementSibling;

        geocodeDestination(query, function(suggestions) {
            suggestionsBox.innerHTML = '';

            suggestions.forEach(suggestion => {
                const p = document.createElement('p');
                p.textContent = suggestion.place_name;
                p.addEventListener('click', function() {
                    e.target.value = suggestion.place_name;
                    suggestionsBox.innerHTML = '';
                });
                suggestionsBox.appendChild(p);
            });
        });
    }
});

document.getElementById('destinationInputs').addEventListener('change', function(e) {
    if (e.target && e.target.className === 'destinationInput') {
        const query = e.target.value;
        geocodeDestination(query, function(suggestions) {
            if (suggestions.length) {
                const coordinates = suggestions[0].center;
                new mapboxgl.Marker({ color: colors[currentColorIndex] }).setLngLat(coordinates).addTo(map);
                
                if (!startPoint) {
                    startPoint = coordinates;
                    endPoint = coordinates;
                } else {
                    fetchRoute(endPoint, coordinates, 'driving-traffic', function(routeCoordinates, distance, duration) {
                        if (routeCoordinates) {
                            const segmentInfo = {
                                start: endPoint,
                                end: coordinates,
                                distance: distance.toFixed(2),
                                time: duration.toFixed(2),
                                color: colors[currentColorIndex]
                            };
                            segmentsData.push(segmentInfo);

                            map.addLayer({
                                'id': `route-${currentColorIndex}`,
                                'type': 'line',
                                'source': {
                                    'type': 'geojson',
                                    'data': {
                                        'type': 'Feature',
                                        'properties': {},
                                        'geometry': {
                                            'type': 'LineString',
                                            'coordinates': routeCoordinates
                                        }
                                    }
                                },
                                'layout': {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                },
                                'paint': {
                                    'line-color': colors[currentColorIndex],
                                    'line-width': 4
                                }
                            });

                            currentColorIndex = (currentColorIndex + 1) % colors.length;

                            totalDistance += distance;
                            totalTime += duration;
                            document.getElementById('totalDistance').textContent = totalDistance.toFixed(2);
                            document.getElementById('totalTime').textContent = totalTime.toFixed(2);

                            endPoint = coordinates;

                            const li = document.createElement('li');
                            li.textContent = `From [${segmentInfo.start}] to [${segmentInfo.end}]: Distance = ${segmentInfo.distance} km, Time = ${segmentInfo.time} mins`;
                            document.getElementById('segments').appendChild(li);

                            const th = document.createElement('th');
                            th.textContent = `Segment ${segmentsData.length}`;
                            document.querySelector('#transportationTable thead tr').appendChild(th);

                            updateTransportationTable();
                        }
                    });
                }

                const li = document.createElement('li');
                li.textContent = `Lat: ${coordinates[1].toFixed(4)}, Lng: ${coordinates[0].toFixed(4)}`;
                document.getElementById('points').appendChild(li);
            }
        });
    }
});
