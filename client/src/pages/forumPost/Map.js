import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Marker,
} from "@vis.gl/react-google-maps";

export default function MapView({ geolocation }) {
  // If geolocation is provided, use it; otherwise use a default location.
  const position = geolocation || { lng: -71.09712751258535, lat: 42.34671555580396 };
  
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "65vw", height: "30vh" }}
        defaultCenter={position}
        defaultZoom={16}
        gestureHandling="greedy"
        disableDefaultUI={true}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}