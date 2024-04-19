"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Location ={
    userLocation:{ lat: number, lng: number },
    query:string,
    setQuery:()=>any,
    setUserlocation:()=>any,
    lat:number,
    lng:number,
}

export const UserLocationContext = createContext<Location | null >(null);
interface Props{
    [propsName:string]:any;
}

export const UserLocationProvider =()=>{
    const [userLocation, setUserlocation]=useState<{ lat: number, lng: number }[]>([]);
    const [query,setQuery]=useState("")
    const getUserLocation = ()=>{
        navigator.geolocation.getCurrentPosition(function(pos){ 
            setUserlocation((prevUserLocation) => ({
                ...prevUserLocation,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            }));
            
        })
    }
    
    useEffect(()=>{
        const askForLocationPermission = () => {
        getUserLocation();
        }
        if ("geolocation" in navigator) {
            // Ask for permission
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                if (result.state === "granted") {
                    // Permission already granted
                    askForLocationPermission();
                } else if (result.state === "prompt") {
                    // Permission not yet granted, ask the user
                    askForLocationPermission();
                } else if (result.state === "denied") {
                    // Permission denied, handle accordingly
                    toast.error("Location access denied by the user.", {
                    duration: 1000,
                    });
                }
                })
                .catch((error) => {
                // Handle error
                console.error("Error checking location permission:", error);
                });
            } else {
            // Geolocation is not supported
            toast.error("Geolocation is not supported by this browser.", {
                duration: 1000,
            });
            }
    },[])
 
    
    const value = { 
        userLocation,
        query,
        setQuery,
        setUserlocation};
    return userLocation
}


export default UserLocationProvider;