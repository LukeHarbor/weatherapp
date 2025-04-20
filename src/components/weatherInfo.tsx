import React from 'react';
import { useAppSelector } from '../app/hooks';
import type { RootState } from '../app/store';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const getWeatherEmoji = (desc: string) => {
  const d = desc.toLowerCase();
  if (d.includes('clear')) return '☀️';
  if (d.includes('cloud')) return '☁️';
  if (d.includes('rain')) return '🌧️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('storm')) return '⛈️';
  return '🌤️';
};

const WeatherInfo: React.FC = () => {
  const { weather, unit, error } = useAppSelector((state: RootState) => state.weather);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!weather) return <p>No location selected.</p>;

  const current = weather.forecast[0];
  const temp = unit === 'C' ? current.tempC : current.tempF;
  const feels = unit === 'C' ? current.feels_like_C : current.feels_like_F;

  const pressure = weather.main.pressure;
  const pressurePct = Math.min(100, Math.max(0, ((pressure - 950) / 100) * 100));

  const windSpeed = weather.wind.speed;
  const windDeg = weather.wind.deg;

  return (
    <div style={{ marginTop: 20 }} className="temp-info">
      <h2>{weather.name}</h2>
      <span>
        {weather.weather[0].description}
        {getWeatherEmoji(weather.weather[0].description)}{' '}
      </span>
      <h3>{temp.toFixed(1)}°</h3>
      <p className="feeling">Feels like {feels.toFixed(1)}°</p>

      <div
        className="graphs"
        style={{ display: 'flex', gap: '24px', marginTop: 10, flexWrap: 'wrap' }}
      >
        <div style={{ width: 80, textAlign: 'center' }} className="humidity">
          <CircularProgressbar
            value={weather.main.humidity}
            text={`${weather.main.humidity}%`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: '#00BFFF',
              trailColor: '#eee',
              textColor: '#333',
            })}
          />
          <div>Humidity</div>
        </div>

        <div style={{ width: 80, textAlign: 'center' }} className="pressure">
          <CircularProgressbar
            value={pressurePct}
            text={`${pressure} hPa`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: '#FAA307',
              trailColor: '#eee',
              textColor: '#333',
            })}
          />
          <div>Pressure</div>
        </div>

        <div style={{ position: 'relative', width: 80 }} className="wind">
          <CircularProgressbar
            value={0}
            text={`${windSpeed.toFixed(1)} m/s`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: '#4CAF50',
              trailColor: '#eee',
              textColor: '#333',
            })}
          />
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: `translateX(-50%) rotate(${windDeg}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <path
              d="M12 2 L12 18 M6 12 L12 2 18 12"
              stroke="#333"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div>Wind</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
