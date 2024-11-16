import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Marker,
} from "@vis.gl/react-google-maps";

export default function MapView() {
  const position = { lat: 42.34671555580396, lng: -71.09712751258535 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div>Terrier Connect Map View</div>
      <Map
        style={{ width: "100vw", height: "30vh" }}
        defaultCenter={position}
        defaultZoom={16}
        gestureHandling={"greddy"}
        disableDefaultUI={true}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}