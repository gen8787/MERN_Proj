import React, { useEffect, useRef, useState } from 'react';
import L from "leaflet";
import LeafletMap from 'react-leaflet';

const Map = ({markerPosition}) => {

//==   S T A T E   ==||

//==   M A P   ==||
    //==   C R E A T E   M A P   ==||
    const mapRef = useRef(null);
    
    const style = {
        width: "100%",
        height: "500px"
    };

    useEffect(() => {
        mapRef.current = L.map("map", {
        center: [46.8427, -121.7382],
        zoom: 13,
        layers: [
            L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            })
        ]
        });
    }, []);

    //==   A D D   M A R K E R   ==||
    const markerRef = useRef(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setLatLng(markerPosition);
        } else {
            markerRef.current = L.marker(markerPosition).addTo(mapRef.current);
        }
        },
        [markerPosition]
    );

//==   R E T U R N   ==||
    return (
        <div id="map" style={style}>
            
        </div>
    )
}

export default Map;