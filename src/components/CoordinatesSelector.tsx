import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useLoadScript } from "@react-google-maps/api";

const center = {
    lat: 36.76997767965763,
    lng: 10.20669137562596,
}

const CoordinatesSelector = ({ onCoordinatesSelect }) => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAsB4Rldm6luC9i1McHiHlX7ymOKmPnAHw"
  });

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={{ height: '400px', width: '100%' }}
      zoom={8}
      center={center}
      onClick={(e) => {
        setSelectedCoords([e.latLng.lat(), e.latLng.lng()]);
        onCoordinatesSelect(e);
      }}
    >
      {selectedCoords && (
        <Marker
          position={{ lat: selectedCoords[0], lng: selectedCoords[1] }}
          animation={window.google.maps.Animation.DROP}
        />
      )}
    </GoogleMap>
  );
};

export default CoordinatesSelector;