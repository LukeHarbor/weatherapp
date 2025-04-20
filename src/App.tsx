import React from 'react';
import './App.css';

import WeatherInput from './components/weatherInput';
import UnitToggle from './components/unitToggle';
import WeatherInfo from './components/weatherInfo';
import WeatherMap from './components/weatherMap';
import WeatherChart from './components/weatherChart';

const App: React.FC = () => {
  return (
    <div className="appWrap" style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <div className="box info">
        <h1>Weather App</h1>

        <div className="search-box">
          <WeatherInput />
          <UnitToggle />
        </div>

        <WeatherInfo />
      </div>

      <div className="rightWrap">
        <div className="box map">
          <div className="map-info">
            <span>Click on the map to get the weather</span>
          </div>
          <WeatherMap />
        </div>

        <div className="box chart">
          <WeatherChart />
        </div>
      </div>
    </div>
  );
};

export default App;
