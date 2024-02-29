import React, { useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import placeData from "../temp_data/places.json";
import L from "leaflet";
import mapState from "../global_state/map";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";

const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  // iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
});

const MapComponent = ({ onSelect }) => {
  const markerRef = useRef({});
  const [map, setMap] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const handlePlaceSelect = (place) => {
    onSelect({ target: { name: "location", value: place, type: "location" } });
    setSelectedPlace(place);
    map.setView(place.location, 16);
    markerRef[place.id].openPopup();
  };
  const { selectedPlace, setSelectedPlace } = mapState();
  const [placeData, setPlaceData] = useState([]);
  const transformedData = useMemo(() => {
    return placeData.map((place) => ({
      location: [place.geometry.location.lat, place.geometry.location.lng],
      name: place.name,
      icon: place.icon,
      id: place.place_id,
    }));
  }, [placeData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={[13.736717, 100.523186]} // Initial map center
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
        />
        {transformedData.length > 0 &&
          transformedData.map((p) => (
            <Marker
              key={`marker_${p.id}`}
              position={p.location}
              icon={icon}
              ref={(ref) => (markerRef[p.id] = ref)}
            >
              <Popup>{p.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
    ),
    [transformedData]
  );

  const { mutate, isLoading: isSearching } =
    api.google.locationSearch.useMutation({
      onSuccess: (data) => {
        toast.success("Search is Done");
        setPlaceData(data);
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error(e.message);
        }
      },
    });

  return (
    <div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mt-5 sm:flex sm:items-center">
          <div className="w-full">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-blue-gray-900"
            >
              Location Name
            </label>
            <input
              type="text"
              name="location_name"
              id="location_name"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (searchValue !== "") {
                    mutate({ query: searchValue });
                  }
                }
              }}
              disabled={isSearching}
              placeholder="Enter a place name"
              className="mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 lg:text-lg"
            />
          </div>
          {searchValue !== "" && !isSearching && (
            <button
              onClick={() => {
                mutate({ query: searchValue });
              }}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Search
            </button>
          )}
          {isSearching && (
            <div className="flex items-center justify-center">
              <LoadingSpinner size={20} />
            </div>
          )}
        </div>
      </div>
      <div className="flex h-96 w-full">
        <div className="w-1/2">{displayMap}</div>
        <div className="scrollbar w-1/2 overflow-y-scroll">
          <h2 className="mb-4 text-center text-lg font-bold">
            ({transformedData.length}) Found Places
          </h2>
          <ul className="list-disc pl-6">
            {transformedData.map((place) => (
              <li
                key={place.id}
                onClick={() => handlePlaceSelect(place)}
                className={`cursor-pointer ${
                  selectedPlace && selectedPlace.id === place.id
                    ? "font-bold"
                    : ""
                } mb-2 border-b border-gray-300 text-blue-500 hover:text-blue-700`}
              >
                {place.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
