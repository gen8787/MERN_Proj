import React, { useState, useEffect, useRef } from 'react';
import mapboxgl, { Popup } from 'mapbox-gl';
import length from '@turf/length';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuODc4NyIsImEiOiJja2Q2bXA4cHMxYXN0MndrY2E1aHg1dWM4In0.4b6zrIoo4plHMfwHEAgA5w';

const MapBox = () => {
//==   R E F   ==||
    const mapContainerRef = useRef(null);

//==   S T A T E   ==||
    const [lat, setLat] = useState(46.8427);
    const [lng, setLng] = useState(-121.7382);
    const [zoom, setZoom] = useState(13);

//==   U S E   E F F E C T   ==||
    useEffect(() => {
    //==   C R E A T E   M A P   ==||
        const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/gen8787/ckd6o99fw056w1io5gvgqe8ek',
        center: [lng, lat],
        zoom: zoom
        });

//==   A D D   N A V   C O N T R O L S   ==||
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

//==   L O C A T E   ==||
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
            }));

//==   M A P   M O V E   ==||
        map.on('move', () => {
            setLat(map.getCenter().lat.toFixed(4));
            setLng(map.getCenter().lng.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

//==   M E A S U R E   ==||
        const distanceContainer = document.getElementById('distance');

//==   M E A S U R E   J S O N   ==||
        var geojson = {
            'type': 'FeatureCollection',
            'features': []
        };

//==   L I N E   S T R I N G   ==||
        var linestring = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };

//==   M A P   L O A D   A D D   S O U R C E   ==||
        map.on('load', function () {
            map.addSource('geojson', {
                'type': 'geojson',
                'data': geojson
            });

//==   M A P   L O A D   A D D   L A Y E R S   ==||
            map.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'geojson',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#000'
                },
                filter: ['in', '$type', 'Point']
            });

            map.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'geojson',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-color': '#000',
                    'line-width': 2.5
                },
                filter: ['in', '$type', 'LineString']
            });
        });

//==   M A P   O N   C L I C K   ==||
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['measure-points']
            });

            // Remove the linestring from the group
            // So we can redraw it based on the points collection
            if (geojson.features.length > 1) geojson.features.pop();

            // Clear the Distance container to populate it with a new value
            distanceContainer.innerHTML = '';

            // If a feature was clicked, remove it from the map
            if (features.length) {
                var id = features[0].properties.id;
                geojson.features = geojson.features.filter(function (point) {
                    return point.properties.id !== id;
                });
            }
            else {
                var point = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [e.lngLat.lng, e.lngLat.lat]
                    },
                    'properties': {
                        'id': String(new Date().getTime())
                    }
                };

                geojson.features.push(point);
            }

            if (geojson.features.length > 1) {
                linestring.geometry.coordinates = geojson.features.map(
                    function (point) {
                        return point.geometry.coordinates;
                    }
                );

                geojson.features.push(linestring);

                // Populate the distanceContainer with total distance
                var value = document.createElement('pre');
                value.textContent =
                    'Total distance: ' +
                    length(linestring, {units: 'miles'}).toLocaleString(2) +
                    'mi';
                distanceContainer.appendChild(value);
            }

            map.getSource('geojson').setData(geojson);
        });
        

//==   M A P   O N   C L I C K   ==||
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['measure-points']
            });
            // UI indicator for clicking/hovering a point on the map
            map.getCanvas().style.cursor = features.length
                ? 'pointer'
                : 'crosshair';
        });

        // Clean up on unmount
        return () => map.remove();
    }, []);

//==   R E T U R N   ==||
    return (
        <div>
            <div className='sidebarStyle'>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>

            <div id="distance" className="distance-container"></div>

            <div id="mapContainerRef" className='mapContainer' ref={mapContainerRef} />
        </div>
    );
};

export default MapBox;