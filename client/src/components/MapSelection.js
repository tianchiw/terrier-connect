import { useState } from "react";
import {
  APIProvider,
  Map,
  Marker
} from "@vis.gl/react-google-maps";

export default function MapView({ geolocation, onCoordinatesChange }) {
  // If geolocation is provided, use it; otherwise use a default location.
  const initialPosition = geolocation || { lng: -71.10540390014648, lat: 42.35050441261373 };
  
  // State to store the position of the placed marker
  const [markerPosition, setMarkerPosition] = useState(initialPosition);

  const handleMapClick = (e) => {
    // When the user clicks on the map, `e.latLng` contains the latitude and longitude
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    const newPosition = { lat, lng };

    // Update the marker inside MapView
    setMarkerPosition(newPosition);
    // If a callback is provided, call it to pass the coordinates back up
    if (onCoordinatesChange) {
        onCoordinatesChange(newPosition);
      }
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "70vw", height: "30vh" }}
        defaultCenter={initialPosition}
        defaultZoom={16}
        gestureHandling="greedy"
        disableDefaultUI={true}
        onClick={handleMapClick} // Capture click events
      >
        {markerPosition && <Marker position={markerPosition} />}
      </Map>
    </APIProvider>
  );
}
