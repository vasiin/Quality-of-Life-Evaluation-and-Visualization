import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import DeckGL from "@deck.gl/react";
import { MapView, WebMercatorViewport } from "@deck.gl/core";
import { TileLayer, TripsLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, PathLayer, LineLayer } from "@deck.gl/layers";
import trip_path from "~/temp_data/direction.json";
import trip_path_2 from "~/temp_data/direction2.json";
import trip_path_3 from "~/temp_data/direction3.json";
import mapViewState from "../global_state/mapview";

const COPYRIGHT_LICENSE_STYLE = {
  position: "absolute",
  right: 0,
  bottom: 0,
  backgroundColor: "hsla(0,0%,100%,.5)",
  padding: "0 5px",
  font: "12px/20px Helvetica Neue,Arial,Helvetica,sans-serif",
};

const LINK_STYLE = {
  textDecoration: "none",
  color: "rgba(0,0,0,.75)",
  cursor: "grab",
};

// function decodePolyline(encoded) {
//     if (!encoded) {
//         return [];
//     }
//     var poly = [];
//     var index = 0, len = encoded.length;
//     var lat = 0, lng = 0;

//     while (index < len) {
//         var b, shift = 0, result = 0;

//         do {
//             b = encoded.charCodeAt(index++) - 63;
//             result = result | ((b & 0x1f) << shift);
//             shift += 5;
//         } while (b >= 0x20);

//         var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
//         lat += dlat;

//         shift = 0;
//         result = 0;

//         do {
//             b = encoded.charCodeAt(index++) - 63;
//             result = result | ((b & 0x1f) << shift);
//             shift += 5;
//         } while (b >= 0x20);

//         var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
//         lng += dlng;

//         var p = [ lng / 1e5,lat / 1e5,

//     ];
//         poly.push(p);
//     }
//     return poly;
// }

function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }
  var poly = [];
  var index = 0,
    len = encoded.length;
  var lat = 0,
    lng = 0;

  while (index < len) {
    var b,
      shift = 0,
      result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);

    var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result = result | ((b & 0x1f) << shift);
      shift += 5;
    } while (b >= 0x20);

    var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    var p = [lng / 1e5, lat / 1e5];
    poly.push({
      coordinates: p,
      timestamp: Math.floor(new Date().getTime() / 1000) + 5 * index,
    });
  }
  return poly;
}

function generateColorArray() {
  const r = Math.floor(Math.random() * 256); // Random red component (0-255)
  const g = Math.floor(Math.random() * 256); // Random green component (0-255)
  const b = Math.floor(Math.random() * 256); // Random blue component (0-255)

  const colorArray = [r, g, b];

  return colorArray;
}
/* global window */
const devicePixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1;

function getTooltip({ tile }) {
  if (tile) {
    const { x, y, z } = tile.index;
    return `tile: x: ${x}, y: ${y}, z: ${z}`;
  }
  return null;
}

export default function App({ showBorder = false, onTilesLoad = null }) {
  const { view_state, setViewState } = mapViewState();
  const tripData = [...trip_path_2.routes, ...trip_path_3.routes];
  const [hoverInfo, setHoverInfo] = useState({});
  const [activeLink, setActiveLink] = useState({});
  const [colors] = useState(new Array(tripData.length).fill([187, 189, 191]));
  const deckRef = useRef(null);
  const OnClickInfo = (info) => {
    const viewport = new WebMercatorViewport({
      ...view_state,
      width: deckRef.current.deck.width,
      height: deckRef.current.deck.height,
    });
    const { longitude, latitude, zoom } = viewport.fitBounds(
      info.object.bounds
    );
    setViewState({ longitude, latitude, zoom });
    setActiveLink(info);
  };
  const layerData = new TripsLayer({
    id: "trips-layer",
    data: tripData.map((v, i) => {
      const datum = decodePolyline(v.overview_polyline.points);
      return {
        waypoints: datum,
        color: activeLink?.object?.name === v.summary ? [255, 0, 0] : colors[i],
        name: v.summary,
        bounds: [
          [v.bounds.northeast.lng, v.bounds.northeast.lat],
          [v.bounds.southwest.lng, v.bounds.southwest.lat],
        ],
      };
    }),
    getPath: (d) => d.waypoints.map((p) => p.coordinates),
    getColor: (d) => d.color,
    opacity: 1,
    widthMinPixels: 5,
    jointRounded: true,
    fadeTrail: false,
    trailLength: 200,
    currentTime: 100,
    // Update app state
    onHover: (info) => setHoverInfo(info),
    onClick: (info) => OnClickInfo(info),
    // Enable picking
    pickable: true,
  });
  const tileLayer = new TileLayer({
    data: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],

    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 20,

    pickable: true,
    onViewportLoad: onTilesLoad,
    autoHighlight: showBorder,
    highlightColor: [60, 60, 60, 40],
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        }),
        showBorder &&
          new PathLayer({
            id: `${props.id}-border`,
            data: [
              [
                [west, north],
                [west, south],
                [east, south],
                [east, north],
                [west, north],
              ],
            ],
            getPath: (d) => d,
            getColor: [255, 0, 0],
            widthMinPixels: 4,
          }),
      ];
    },
  });
  return (
    <div className="container relative top-0 h-screen max-w-full">
      <DeckGL
        ref={deckRef}
        layers={[tileLayer, layerData]}
        views={new MapView({ repeat: true })}
        initialViewState={view_state}
        controller={true}
        getTooltip={getTooltip}
      >
        {hoverInfo.object && (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: hoverInfo.x,
              top: hoverInfo.y,
            }}
          >
            {hoverInfo.object.name}
          </div>
        )}
        <div style={COPYRIGHT_LICENSE_STYLE}>
          {"© "}
          <a
            style={LINK_STYLE}
            href="http://www.openstreetmap.org/copyright"
            target="blank"
          >
            OpenStreetMap contributors
          </a>
        </div>
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
