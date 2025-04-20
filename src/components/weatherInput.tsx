import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCity, fetchWeatherByCity, clearError } from './weatherSlice';
import type { RootState } from '../app/store';

const WeatherInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const city = useAppSelector((state: RootState) => state.weather.city);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCity(e.target.value));
  };

  const handleSearch = () => {
    if (!city.trim()) return;
    dispatch(clearError());
    dispatch(fetchWeatherByCity(city.trim()));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-wrap">
      <input
        type="text"
        placeholder="Enter location..."
        value={city}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Get Weather</button>
    </div>
  );
};

export default WeatherInput;
