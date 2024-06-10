import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/request";

export const fetchCityNameAndWeather = createAsyncThunk(
  "weather/fetchCityNameAndWeather",
  async (location, thunkAPI) => {
    try {
      const result = await axiosInstance.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
      );

      if (result.status === 200) {
        const city = result.data?.results?.[0]?.components?.city;
        await thunkAPI.dispatch(fetchCurrentWeather(city));
        await thunkAPI.dispatch(fetchDailyWeather(city));
        return city;
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.warn("ERROR in fetchCityNameAndWeather", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrentWeather",
  async (city, thunkAPI) => {
    try {
      const result = await axiosInstance.get(
        `/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );

      console.log(result.data);
      if (result.status === 200) {
        return {
          temp: result.data.main.temp,
          icon: result.data.weather[0].icon,
          name: result.data.weather[0].main,
        };
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.warn("ERROR in fetchCurrentWeather", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDailyWeather = createAsyncThunk(
  "weather/fetchDailyWeather",
  async (city, thunkAPI) => {
    try {
      const result = await axiosInstance.get(
        `/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );

      console.log("result", result.data);
      if (result.status === 200) {
        return result.data.list;
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.warn("ERROR in fetchDailyWeather", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    city: null,
    currentWeather: null,
    status: "idle",
    error: null,
    temperatureFormat: "Celsius",
    todayWeatherData: null,
    weekWeatherData: null,
  },
  reducers: {
    setTemperatureFormat: (store, action) => {
      return {
        ...store,
        temperatureFormat: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityNameAndWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCityNameAndWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.city = action.payload;
      })
      .addCase(fetchCityNameAndWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.currentWeather = action.payload;
      })
      .addCase(fetchDailyWeather.fulfilled, (state, action) => {
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];

        // const todayWeatherData = [];
        const weekWeatherData = {};

        action.payload.forEach((item) => {
          let day = item.dt_txt.split(" ")[0];
          if (!weekWeatherData.hasOwnProperty(day)) {
            weekWeatherData[day] = [];
          }
          weekWeatherData[day].push({
            time: item.dt_txt.split(" ")[1],
            temp: item.main.temp,
            icon: item.weather[0].icon,
            name: item.weather[0].main,
          });
        });
        console.log("weekWeatherData", weekWeatherData);

        state.weekWeatherData = weekWeatherData;
      });
  },
});

export const { setTemperatureFormat } = weatherSlice.actions;
export default weatherSlice.reducer;
