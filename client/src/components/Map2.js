import React, { useState } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as mpData from './mpData.json';

const Map2 = () => {

//==   S T A T E   ==||
    const [activeRoute, setActiveRoute] = useState(null);

//==   H A N D L E R S   ==||

//==   O T H E R   ==||
    const icon = new Icon({
        iconUrl: "",
        iconSize: [25, 25]
    });

    return (
        <div>
        <LeafletMap center={[40.014984, -105.270546]} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
            
            {
                mpData.routes.map(route => (
                    <Marker
                        key={route.id}
                        position={[route.latitude, route.longitude]}
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

        </LeafletMap>
        </div>
    )
}

export default Map2
