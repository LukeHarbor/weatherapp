import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export type ForecastPoint = {
  date: string;
  label: string;
  tempC: number;
  tempF: number;
  feels_like_C: number;
  feels_like_F: number;
  description: string;
  humidity: number;
  windSpeed: number;
};

export type WeatherData = {
  name: string;
  coord: { lat: number; lon: number };
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: { description: string }[];
  forecast: ForecastPoint[];
};

interface WeatherState {
  city: string;
  unit: 'C' | 'F';
  weather: WeatherData | null;
  error: string;
}

const initialState: WeatherState = {
  city: '',
  unit: 'C',
  weather: null,
  error: '',
};

const parseWeatherData = (data: any): WeatherData => {
  const forecast = data.list.map((item: any) => {
    const dt = new Date(item.dt_txt);
    return {
      date: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      label: dt.toLocaleString(undefined, {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      tempC: item.main.temp,
      tempF: (item.main.temp * 9) / 5 + 32,
      feels_like_C: item.main.feels_like,
      feels_like_F: (item.main.feels_like * 9) / 5 + 32,
      description: item.weather?.[0]?.description ?? '',
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    };
  });

  return {
    name: data.city.name,
    coord: data.city.coord,
    main: data.list[0].main,
    weather: data.list[0].weather,
    wind: data.list[0].wind,
    forecast,
  };
};

export const fetchWeatherByCity = createAsyncThunk<
  WeatherData,
  string,
  { rejectValue: string }
>('weather/fetchByCity', async (city, { rejectWithValue }) => {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    return parseWeatherData(res.data);
  } catch {
    return rejectWithValue('Could not fetch weather for that city.');
  }
});

export const fetchWeatherByCoords = createAsyncThunk<
  WeatherData,
  { lat: number; lon: number },
  { rejectValue: string }
>('weather/fetchByCoords', async ({ lat, lon }, { rejectWithValue }) => {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
    });
    return parseWeatherData(res.data);
  } catch {
    return rejectWithValue('Could not fetch weather for that location.');
  }
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    toggleUnit(state) {
      state.unit = state.unit === 'C' ? 'F' : 'C';
    },
    clearError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.error = '';
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.weather = null;
        state.error = action.payload ?? 'Something went wrong';
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.error = '';
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.weather = null;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export const { setCity, toggleUnit, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
  