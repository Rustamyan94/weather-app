import React, { useState } from "react";
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import {
  fetchCurrentWeather,
  fetchDailyWeather,
  setCity,
  setTemperatureFormat,
} from "../../store/slices/weatherSlice";

export default function Header() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
        />
        <button
          onClick={() => {
            if (search) {
              dispatch(setCity(search));
              dispatch(fetchCurrentWeather(search));
              dispatch(fetchDailyWeather(search));
            }
          }}
        >
          Search City
        </button>
      </div>
      <div className={styles.temperatureChooser}>
        <label>
          <input
            type="radio"
            name="temperatureFormat"
            value="Celsius"
            defaultChecked
            onClick={() => {
              dispatch(setTemperatureFormat("Celsius"));
            }}
          />
          °C
        </label>
        <label>
          <input
            type="radio"
            name="temperatureFormat"
            value="Fahrenheit"
            onClick={() => {
              dispatch(setTemperatureFormat("Fahrenheit"));
            }}
          />
          °F
        </label>
      </div>
    </header>
  );
}
