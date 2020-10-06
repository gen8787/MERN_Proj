import React, { useState, useEffect, useRef } from 'react';
import mapboxgl, { Popup } from 'mapbox-gl';
import length from '@turf/length';
import { Container, Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TableFoot} from '@material-ui/core';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuODc4NyIsImEiOiJja2Q2bXA4cHMxYXN0MndrY2E1aHg1dWM4In0.4b6zrIoo4plHMfwHEAgA5w';

const MapBox = () => {
//==   R E F   ==||
    const mapContainerRef = useRef(null);

//==   S T A T E   ==||
    const [lat, setLat] = useState(46.8427);
    const [lng, setLng] = useState(-121.7382);
    const [zoom, setZoom] = useState(13);

    const [points, setPoints] = useState([]);
    const [lines, setLines] = useState([]);
    const [totalDist, setTotalDist] = useState(0);
    const [munterRate, setMunterRate] = useState(0);
    const [totalTime, setTotalTime] = useState([]);
    const [ele, setEle] = useState([]);

    const [mouseLoc, setMouseLoc] = useState({
        lngPt: 0,
        latPt: 0
    });

//==   B L A N K   U S E   E F F E C T   ==||
    useEffect(() => {
    }, []);

//==   F U N C T I O N S   ==||
    function munterCalc(dist, elev, rate) {
        // time = (dist(KM) + (elev(M)/100)) / rate
        let retTime = ((dist * 1.609344) + (elev/100)) / rate
        totalTime.push(retTime * 60)
        return retTime * 60;
    };

    function ttlTime(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i ++) {
            sum = sum + arr[i]
        }
        // console.log(sum);
        return sum;
    };

//==   U S E   E F F E C T   ==||
    useEffect(() => {
    //==   C R E A T E   M A P   ==||
        const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/gen8787/ckfiwhpg61lxx19t4zko0rnr5',
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
        map.on('move', (e) => {
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
                lines.pop();
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
                points.push({
                    'lngPt': point.geometry.coordinates[0],
                    'latPt': point.geometry.coordinates[1]
                })

                var MapboxElevation = require('mapbox-elevation');
                var getElevation = MapboxElevation(mapboxgl.accessToken);
                getElevation([e.lngLat.lng, e.lngLat.lat], function(err, elevation) {
                    ele.push(elevation);
                });
            }

            if (geojson.features.length > 1) {
                linestring.geometry.coordinates = geojson.features.map(
                    function (point) {
                        return point.geometry.coordinates;
                    }
                );

                geojson.features.push(linestring);
                let newLine = length(linestring, {units: 'miles'});
                newLine.toFixed(2)
                lines.push(newLine);                

                // Populate the distanceContainer with total distance
                var value = document.createElement('pre');
                value.textContent =
                    'Total distance: ' +
                    length(linestring, {units: 'miles'}).toLocaleString() +
                    'mi';
                distanceContainer.appendChild(value);
                setTotalDist(length(linestring, {units: 'miles'}));
            }

            map.getSource('geojson').setData(geojson);
        });

//==   M A P   O N   M O V E   ==||
        map.on('mousemove', function (e) {
            setMouseLoc({lng: e.lngLat.lng.toFixed(4), lat: e.lngLat.lat.toFixed(4)});
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
            <div className='sidebarStyle1'>
                Map Center: Lng: {lng} | Lat: {lat} | Zoom: {zoom}
            </div>

            <div className='sidebarStyle2'>
                Cursor @ Lng: {mouseLoc.lng} | Lat: {mouseLoc.lat}
            </div>

            <div id="distance" className="distance-container"></div>

            <div id="mapContainerRef" className='mapContainer' ref={mapContainerRef} />

            <div className="pt-3">
                Munter Rate: <input type="number" name="munterRate" onChange={ (e) => setMunterRate(e.target.value)}/>
                <small> Ex: Uphill = 4, Flat = 6, Downhill = 8</small>
            </div>

            <hr/>

            <TableContainer>
            <Table aria-label="">
                <TableHead>
                    <TableRow>
                        <TableCell className="font-weight-bold">Leg</TableCell>
                        <TableCell className="font-weight-bold">Distance (mi)</TableCell>
                        <TableCell className="font-weight-bold">Vertical (ft)</TableCell>
                        <TableCell className="font-weight-bold">Est. Time</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                {
                    lines.map((line, i) => 
                        <TableRow key={i+1}>
                            {/*===   L E G   ===*/}
                            <TableCell>{i} - {i + 1}</TableCell>

                            {/*===   D I S T A N C E   ===*/}
                            {
                                (i == 0) ? <TableCell>{ line.toFixed(2) }</TableCell>
                                : <TableCell>{ (line - lines[i-1]).toFixed(2) }</TableCell>
                            }

                            {/*===   V E R T I C A L   ===*/}
                            <TableCell>{ (ele[i+1] - ele[i]).toFixed(0) }</TableCell>
                            {/* {
                                (i == 0) ? <TableCell>{ 0 }</TableCell>
                                : <TableCell>{ ele[i] - ele[i-1] }</TableCell>
                            } */}

                            {/*===   T I M E   ===*/}
                            {
                                (i == 0) ? <TableCell>{munterCalc(line, (ele[i] - ele[i+1]), 4).toFixed(0)}</TableCell>
                                : <TableCell>{munterCalc(line-lines[i-1], (ele[i] - ele[i+1]), 4).toFixed(0)}</TableCell>
                            }
                        </TableRow>
                    )
                }

                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="font-weight-bold">Total Dist: {totalDist.toFixed(2)} mi.</TableCell>
                    <TableCell className="font-weight-bold">Total Est. Time: {ttlTime(totalTime)}</TableCell>
                </TableRow>

                </TableBody>
            </Table>
        </TableContainer>


        </div>
    );
};

export default MapBox;