/*google google*/
import React from 'react'
import './Map.css'
import img from './components/logo.png'
import { useRef, useState } from 'react';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { internal_processStyles } from '@mui/styled-engine-sc';

const containerStyle = {
    width: '80vh',
    height: '600px',
};

const center = {
    lat: 20.5937,
    lng: 78.9629
};

function Map() {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCJMLOaYcxqrwd4JZ0hWNYXjYpqbX-J-k8",
        libraries: ['places'],
    })
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('')
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()
    // const [waypts, setWaypts] = useState({})
    const [add, setAdd] = useState(0)
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const addInput = () => {
        const a = [...add, []]
        setAdd(a)
    }

    async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            return
        }

        setOrigin(originRef.current.value);
        setDestination(destinationRef.current.value);

        const directionService = new google.maps.DirectionsService() // eslint-disable-line
        const results = await directionService.route(
            {
                origin: originRef.current.value,
                destination: destinationRef.current.value,
                travelMode: google.maps.TravelMode.DRIVING, // eslint-disable-line
            }
        )
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
    }

    function clearAll() {
        setDirectionsResponse(null)
        setDistance('')
        originRef.current.value = ''
        destinationRef.current.value = ''
        setOrigin('')
        setDestination('')
    }

    return isLoaded ? (
        <div className='header'>
            <div className='img__header'>
                <img src={img} alt="Graviti-logo" />
            </div>
            <div className='header__intro'>Lets calculate distance from Google maps</div>

            <div className="distance__show">
                <label className='origin__text'>Origin</label>
                <Autocomplete>
                    <input
                        type='text'
                        placeholder='origin'
                        ref={originRef}
                        className='origin__input'
                    />
                </Autocomplete>

                <label className='destination__text'>Destination</label>
                <Autocomplete>
                    <input
                        type='text'
                        placeholder='destination'
                        ref={destinationRef}
                        className='destination__input'
                    />
                </Autocomplete>
                <button type='submit' onClick={calculateRoute} className='calculate__distance'>Calculate</button>
                <button type='submit' onClick={clearAll} className='clear__all'>Clear</button>


                <div className='show__distance'>
                    <h2>Distance</h2>
                    <h1>{distance}</h1>
                    <div className='show__text'>The distance between <h5>{destination}</h5> and <h5>{origin}</h5> via the selected route is {distance}</div>
                </div>
            </div>

            <div className='map__show'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={5}
                    options={{
                        zoomControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                    }}
                >
                    <Marker position={center} />
                    {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                    <></>
                </GoogleMap>
            </div>
        </div>
    ) : <></>
}

export default React.memo(Map)
