import React, { useEffect, useState, useRef, useMemo} from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Map, {Popup,ScaleControl,FullscreenControl, GeolocateControl,Marker, NavigationControl} from 'react-map-gl';
import Pin from './components/Pin'
import CITIES  from './components/data.json'





mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VudHNhZHplIiwiYSI6ImNsMWYweWMzYzB0MTkzY21mMXkzZGc0eHIifQ.JKkN2cnHd7wLeJ8NhGW18g';

function App() {

  const [showPopup, setShowPopup] = useState(true);
  const [weather, setWeather] = useState({})
  const [correctCor, setCorrectCor] = useState(false)
  const [lng, setlng] = useState(-1)
  const [lat, setlat] = useState(-1)
  const [popupInfo, setPopupInfo] = useState(null);
 

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
        >
          <Pin onClick={() => setPopupInfo(city)} />
        </Marker>
      )),
    []
  );

 function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
     console.log("Geolocation is not supported by this browser.");
    }
  }

 function showPosition(position) {
  fetchData(position.coords.latitude, position.coords.longitude);
    setlng(position.coords.longitude)
  setlat(position.coords.latitude)
  }
  async function fetchData(latitude, longitude){
    const key = "583e19073b11a4e1f4b0d0c0a59ca92a"
    const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`); 
    if(data.status == 200){
      const res = await data.json();
      setWeather({
       temperature : Math.floor(res.main.temp ),
       description : res.weather[0].description,
       iconId : res.weather[0].icon,
       city : res.name,
       country : res.sys.country,
       competition : res.visibility
      })
      setCorrectCor(true)
    } else{
      return []
    } 

  }
useEffect(()=>{
  getLocation()
},[correctCor])
useEffect(() => {
 popupInfo&& fetchData(popupInfo.latitude, popupInfo.longitude)
},[popupInfo])




  return ( 
    <>
     <Map
  initialViewState={{
      longitude: 0, 
      latitude:0,
      zoom: 1
    }}
    style={{width:FullscreenControl, height:1000}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
  >
    {popupInfo && (
        <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
          <div><p>{popupInfo.name}</p></div>
        </Popup>
        )}
        {showPopup &&(<Popup longitude={lng} latitude={lat}
        anchor="bottom"
        onClose={() => setShowPopup(false)}>
       <p className='location-text'>You are here</p> 
      </Popup>)}
      <ScaleControl />
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      {pins}
  
      {correctCor &&
      <div className="container">
        <div className="app-title">
            <p>Weather</p>
        </div>
        <div className="weather-container">
          
            <div className="weather-icon">
            <img src={`icons/${weather.iconId }.png`}/>
            </div>
            <div className="temperature-value">
                <p>{weather.temperature} - °<span>C</span></p>
            </div>
            <div className="temperature-description">
                <p> {weather.description} </p>
            </div>
            <div className="location">
      
                <p>{weather.city}, {weather.country}</p>
            </div>
        </div>
    </div>}

  </Map>
       
  
    </>
  );
}

export default App;