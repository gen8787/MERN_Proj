import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { L, Icon } from 'leaflet';
import * as mpData from './mpData.json';
import { Card, CardTitle, CardText, Button } from 'reactstrap';

const ReactLeafMap = () => {

//==   S T A T E   ==||
    const [activeRoute, setActiveRoute] = useState(null);

    const [curLoc, setCurLoc] = useState({
        coords: {
            lat: 0,
            lon: 0
        }});

    // const [curPos, setCurPos] = useState(null)

//==   U S E   E F F E C T   ==||
    //==   G E T   L O C A T I O N  ==||
    useEffect( () => {
        navigator.geolocation.getCurrentPosition( (position => {
            setCurLoc({
                coords: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }
            })
        }), () => {
            fetch('https://ipapi.co/json')
                .then(res => res.json())
                .then(res => {
                    setCurLoc({
                        coords: {
                            lat: res.latitude,
                            lon: res.longitude
                        }
                    })
                })
            })
    }, []);

//==   H A N D L E R S   ==||
    // const mapClickHandler = (e) => {
    //     setCurPos({curPos: e.latlng})
    //     console.log(curPos);
    // }

//==   O T H E R   ==||
    const icon = new Icon({
        iconUrl: "",
        iconSize: [25, 25]
    });

    const polyline = [
        [40.014984, -105.270546],
        [41.014984, -106.270546],
        [42.014984, -107.270546],
        [43.014984, -108.270546],
        [44.014984, -109.270546],
    ]


    return (
        <div>
        <LeafletMap
            // center={[40.014984, -105.270546]}
            center={[curLoc.coords.lat, curLoc.coords.lon]}
            zoom={13}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
            
            {
                mpData.routes.map(route => (
                    <Marker
                        key={route.id}
                        // position={[route.latitude, route.longitude]}
                        position={[curLoc.coords.lat, curLoc.coords.lon]}
                        onClick={ () => {
                            setActiveRoute(route);
                        }}
                        // icon={icon}
                    />
                ))
            }

            {
                activeRoute && (
                    <Popup
                        position={[activeRoute.latitude, activeRoute.longitude]}
                        onClose={ () => setActiveRoute(null)}
                    >
                        <div>
                            <h6>{activeRoute.name}</h6>
                            <p>{activeRoute.type}, {activeRoute.rating}, {activeRoute.pitches} pitch(s)</p>
                        </div>
                    </Popup>
                )
            }

            <Polyline color="lime" positions={polyline} />

        <Card body className="card">
            <CardTitle>Some Title</CardTitle>
            <CardText>Here's some text to go along with it.</CardText>
            <Button type="submit" color="info">Do Something!</Button>
        </Card>

        </LeafletMap>
        </div>
    )
}

export default ReactLeafMap
