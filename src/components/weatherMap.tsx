import React, { useState, useEffect, useCallback } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchWeatherByCoords } from './weatherSlice';

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_API_KEY as string;
const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY as string;

const TEMP_TILE_URL = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_KEY}`;
const MAP_STYLE = 'mapbox://styles/mapbox/dark-v10';

const WeatherMap: React.FC = () => {
  const dispatch = useAppDispatch();
  const coord = useAppSelector((state) => state.weather.weather?.coord);

  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 5,
  });

  useEffect(() => {
    if (coord) {
      setViewState((prev) => ({
        ...prev,
        latitude: coord.lat,
        longitude: coord.lon,
      }));
    }
  }, [coord]);

  const handleMove = useCallback((event: any) => {
    setViewState(event.viewState);
  }, []);

  const handleClick = useCallback((event: any) => {
    const { lat, lng } = event.lngLat;
    dispatch(fetchWeatherByCoords({ lat, lon: lng }));
  }, [dispatch]);

  return (
    <div style={{ height: '100%' }}>
      <Map
        {...viewState}
        onMove={handleMove}
        onClick={handleClick}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_KEY}
        style={{ width: '100%', height: '100%' }}
      >
        <Source
          id="temp-overlay"
          type="raster"
          tiles={[TEMP_TILE_URL]}
          tileSize={256}
        >
          <Layer
            id="temp-layer"
            type="raster"
            source="temp-overlay"
            paint={{
              'raster-opacity': 0.75,
              'raster-fade-duration': 0,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default WeatherMap;
