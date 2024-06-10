import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchCityNameAndWeather } from "../../store/slices/weatherSlice";
import styles from "./style.module.scss";
import getTemperature from "../../helpers/getTemperature";

export default function Home() {
  const [showDay, setShowDay] = useState();
  const { city, currentWeather, temperatureFormat, weekWeatherData } =
    useSelector(({ weather }) => weather);
  const dispatch = useDispatch();
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position) {
            toast.warn(
              "The page should have a field to search for the needed city"
            );
            return null;
          }
          dispatch(
            fetchCityNameAndWeather({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        (err) => console.warn("getCurrentPosition error:", err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      toast.warn(
        "Geolocation is not available in your browser.Please write city name manually"
      );
    }
  }, []);
  const day =
    showDay &&
    (weekWeatherData?.[showDay]?.find((e) => e.time.startsWith(12)) ||
      weekWeatherData?.[showDay]?.[0]);
  return (
    <div className={styles.main}>
      <div className={styles.todayBlock}>
        {currentWeather && (
          <div className={styles.currentWeather}>
            <h2>{city}</h2>
            <h3>
              {getTemperature(
                showDay ? day.temp : currentWeather.temp,
                temperatureFormat
              )}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${
                showDay ? day.icon : currentWeather.icon
              }@2x.png`}
              alt="Current weather"
            />
            <h3>{showDay ? day.name : currentWeather.name}</h3>
          </div>
        )}

        <div className={styles.timesWeather}>
          {weekWeatherData?.[
            showDay || new Date().toISOString().slice(0, 10)
          ]?.map((e, index) => (
            <div key={index}>
              <span>{e.time}</span>
              <span>{getTemperature(e.temp, temperatureFormat)}</span>
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}.png`}
                alt="Current weather"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.weatherDaysList}>
        {Object.keys(weekWeatherData || {})?.map((key, index) => {
          const day =
            weekWeatherData?.[key]?.find((e) => e.time.startsWith(12)) ||
            weekWeatherData?.[key][0];
          return (
            <div
              onClick={() => {
                setShowDay(key);
              }}
              className={styles.eachDayBlock}
              key={index}
            >
              <span>{day.date}</span>
              <div>
                <h4>{getTemperature(day.temp, temperatureFormat)}</h4>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt="Current weather"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
