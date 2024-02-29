mapboxgl.accessToken = 'pk.eyJ1IjoiYnJvb2sxMjM0IiwiYSI6ImNsbWhyMXJkajA3NDkzZnFzZXV6YW5lZ3QifQ.DxTQHB79qDgP4XTX_GbpKA';

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
var unix_arrival;
var realarrivalTime;
var realdepartureTime;


let geocode = null;

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


//Geo code
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

//Dynamic Fetch route
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





//QOL calculation
function calculateQOLScore(distance, time) {
    const variables = [distance, time];
    const weights = [4, 1.66];

    let weightedSum = 0;
    for (let i = 0; i < variables.length; i++) {
        weightedSum += variables[i] * weights[i];
    }

    return (weightedSum / variables.length).toFixed(2); // จำกัดเฉพาะสองจุดทศนิยม
}


function arrival(inputValue){
    unix_arrival = new Date(inputValue).getTime();
    var arrival_time = unix_arrival / 1000; // Convert to Unix timestamp in seconds
    // arrival_time = arrival_time - 60;
    var unixTimestamp = arrival_time;
    var date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    
    realarrivalTime = date.toString(); // Update the wider scope variable

}

function departure(unix_arrival, TimeminutesToSubtract) {
    var arrival_time = unix_arrival / 1000; // Convert to Unix timestamp in seconds
    TimeminutesToSubtract = TimeminutesToSubtract * 60; //Convert duration time to unix
    var departuretime = arrival_time - TimeminutesToSubtract; // Subtract minutes
    var departureDate = new Date(departuretime * 1000); // Convert to Date object

    // Format the date and time
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = departureDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = departureDate.toLocaleTimeString('en-US', timeOptions);
    
    return formattedDate + '<br>' + formattedTime;
}

//Dynamic adding row
function updateSegmentTable(segmentInfo, realarrivalTime) {
    const table = document.getElementById('segmentsTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();

    const arrivalTimeCell = row.insertCell(0);
    // arrivalTimeCell.textContent = realarrivalTime;
    // จัดรูปแบบเวลาให้ตรงตามที่ต้องการ
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = new Date(realarrivalTime).toLocaleString('en-US', dateOptions);
    const formattedTime = new Date(realarrivalTime).toLocaleString('en-US', timeOptions);
    arrivalTimeCell.innerHTML = formattedDate + '<br>' + formattedTime; // ใช้ <br> เพื่อให้เวลาอยู่บรรทัดต่อไป

    // const fromCell = row.insertCell(1);
    // fromCell.textContent = geocode;

    const toCell = row.insertCell(1);
    // toCell.textContent = geocode;
    // แยกชื่อสถานที่ออกจากที่อยู่
    const placeName = geocode.split(',')[0]; // เลือกเฉพาะชื่อสถานที่
    toCell.textContent = placeName;

    const distanceCell = row.insertCell(2);
    distanceCell.textContent = segmentInfo.distance + ' km';

    const timeCell = row.insertCell(3);
    timeCell.textContent = segmentInfo.time + ' mins';

    const qolCell = row.insertCell(4);
    qol_cal=calculateQOLScore(segmentInfo.distance, segmentInfo.time);
    qolCell.textContent = qol_cal;
    
    const departCell = row.insertCell(5);
    departCell.innerHTML = departure(unix_arrival, segmentInfo.time);  
}




//Add type box
document.getElementById('addDestination').addEventListener('click', function() {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'inputWrapper';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'destinationInput';
    newInput.placeholder = 'Type a destination...';
    inputWrapper.appendChild(newInput);
    console.log(newInput.placeholder);

    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'suggestions';
    inputWrapper.appendChild(suggestionsBox);
    console.log(suggestionsBox.className);

    document.getElementById('destinationInputs').appendChild(inputWrapper);
});
//Geocoding box
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
                    console.log(suggestion.place_name);//Geocode in typing box
                    geocode = suggestion.place_name;
                    suggestionsBox.innerHTML = '';
                });
                
                
                console.log("Geocode",geocode);
                suggestionsBox.appendChild(p);
            });
        });
    }
});

// When the user selects a date and time, update the 'arrival_time' variable
document.getElementById('arrivalTime').addEventListener('change', function() {
    arrival(this.value); // Pass the value to the arrival function
});


document.getElementById('destinationInputs').addEventListener('change', function(e) {
    if (e.target && e.target.className === 'destinationInput') {
        const query = e.target.value;
        geocodeDestination(query, function(suggestions) {
            //condition having arrival time
            if (realarrivalTime && suggestions.length) {
                const coordinates = suggestions[0].center;
                new mapboxgl.Marker({ color: colors[currentColorIndex] }).setLngLat(coordinates).addTo(map);
                
                if (!startPoint) {
                    startPoint = coordinates;
                    endPoint = coordinates;
                } else //route driving-traffic and drawline
                {
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
                            //this line is After updating the segmentsData array:
                            
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

                            //Total Distance and total time in html
                            currentColorIndex = (currentColorIndex + 1) % colors.length;

                            totalDistance += distance;
                            totalTime += duration;
                            document.getElementById('totalDistance').textContent = totalDistance.toFixed(2);
                            document.getElementById('totalTime').textContent = totalTime.toFixed(2);

                            endPoint = coordinates;

                            //segment information:

                            const li = document.createElement('li');
                            //เอา ไปข้อมูลไปใส้ใน table
                            // li.textContent = `Arrival time [${realarrivalTime}] From [${segmentInfo.start}] to [${segmentInfo.end}]: Distance = ${segmentInfo.distance} km, Time = ${segmentInfo.time} mins`;
                            updateSegmentTable(segmentInfo, realarrivalTime);//Call function create Table
                            document.getElementById('segments').appendChild(li);

                            const th = document.createElement('th');
                            th.textContent = `Segment ${segmentsData.length}`;
                            document.querySelector('#transportationTable thead tr').appendChild(th);

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




