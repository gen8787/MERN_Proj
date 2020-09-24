import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

function TestMap() {

    const [markerPosition, setMarkerPosition] = useState({
        lat: 46.8427,
        lng: -121.7382
    });
    
    const { lat, lng } = markerPosition;
    
    function moveMarker() {

        setMarkerPosition({
            lat: lat + 0.0001,
            lng: lng + 0.0001
        });
    }

  // create map
    const mapRef = useRef(null);

    useEffect(() => {
        mapRef.current = L.map('map', {
        center: [46.8427, -121.7382],
        zoom: 16,
        layers: [
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }),
        ]
        });
    }, []);

    // add marker
    let markerRef = useRef(null);
    let popupRef = useRef(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setLatLng(markerPosition);
        } else {
            markerRef.current = L.marker(markerPosition).addTo(mapRef.current);
            markerRef.current.bindPopup(`${lat}, ${lng}`)
        }
        },
        [markerPosition]
    );


    // useEffect(() => {
    //     if (popupRef.current) {
    //         popupRef.current.setLatLng(markerPosition);
    //     } else {
    //         popupRef.current = L.popup(markerPosition).addTo(mapRef.current);
    //     }
    //     },
    //     [markerPosition]
    // );

    
    return (
        <>
        <div id="map"></div>
        <div>
            Current markerPosition: lat: {lat}, lng: {lng}
        </div>
        <button onClick={moveMarker}>Move marker</button>
        </>
    )
}

export default TestMap;