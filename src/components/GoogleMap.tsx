"use client";
import { RestaurantType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
}
const center = {
    lat: 36.76997767965763,
    lng: 10.20669137562596,
}

const getData = async () => {
    const res = await fetch("http://localhost:3000/api/restaurants", {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed!");

    }

    return res.json()
}

export default function GoogleMaps() {
    const [restaurants, setRestaurants] = useState<RestaurantType[]>([])
    const [selected, setSelected] = useState<RestaurantType | null>(null)
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
    });
    useEffect(() => {
        getData().then(data => setRestaurants(data))
    }, [])

    if (loadError) return "Error loading Maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
        >
            {restaurants.map((restaurant) => (
                <MarkerF
                    key={restaurant.id}
                    position={{ lat: restaurant.lat, lng: restaurant.lng }}
                    onClick={() => {
                        restaurant === selected ? setSelected(null) : setSelected(restaurant)

                    }}
                />
            ))}
            {selected && (
                <InfoWindowF
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                    zIndex={1}
                    options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                    <div
                        className="w-full h-1/3 bg-cover p-8 md:h-1/2"
                        style={{
                            backgroundImage: `url(${selected.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    >
                        <div className={`text-${selected.color} w-1/2`}>
                            <h1 className="uppercase font-bold text-3xl">{selected.title}</h1>
                            <p className="text-sm my-8 font-bold">{selected.desc}</p>
                        </div>
                    </div>
                </InfoWindowF>
            )
            }
        </GoogleMap>
    )
}