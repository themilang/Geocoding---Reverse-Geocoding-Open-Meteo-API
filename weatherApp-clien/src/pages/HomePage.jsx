import React, { useState, useEffect } from "react";
import { TiWeatherNight, TiWeatherPartlySunny } from "react-icons/ti";
const apiUrl = import.meta.env.VITE_GEO_API_URL;
const apiKey = import.meta.env.VITE_GEO_API_KEY;
const openmeteoUrl = import.meta.env.VITE_OPEN_METEO_URL;
import WeatherCard from "./WeatherCard";

const HomePage = () => {
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [wind, setWind] = useState("");
  const [rain, setRain] = useState("");
  const [cloudcover, setCloudcover] = useState("");
  const [error, setError] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [days] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [nextDays, setNextDays] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [nextDaysMaxTemp, setNextDaysMaxTemp] = useState("");
  const [nextDaysMinTemp, setNextDaysMinTemp] = useState("");
  const [cityLongitude, setCityLongitude] = useState(null);
  const [cityLatitude, setCityLatitude] = useState(null);
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("API URL:", apiUrl);
        console.log("API Key:", apiKey);

        const reverseGeocode = await fetch(
          `${apiUrl}?text=Berlin&lang=en&limit=10&type=city&format=json&apiKey=${apiKey}`
        );
        if (!reverseGeocode.ok) {
          throw new Error(`Failed to fetch: ${reverseGeocode.status}`);
        }
        const responseGeolocations = await reverseGeocode.json();

        if (responseGeolocations.results) {
          for (let i = 0; i < 12; i++) {
            setTimeout(async () => {
              const longitude = responseGeolocations.results[i].lon;
              const latitude = responseGeolocations.results[i].lat;
              const city = responseGeolocations.results[i].state;

              console.log("City:", city);
              setCity(city);
              console.log("Longitude:", longitude);
              setCityLongitude(longitude);
              console.log("Latitude:", latitude);
              setCityLatitude(latitude);

              const request = await fetch(
                `${openmeteoUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore`
              );
              if (!request.ok) {
                throw new Error(
                  `Failed to fetch weather data: ${request.status}`
                );
              }
              const response = await request.json();

              if (response) {
                setTemperature(response.current.temperature_2m);
                setRain(response.current.rain);
                setCloudcover(response.current.cloud_cover);
                setWind(response.current.wind_speed_10m);

                const currentDate = new Date();
                const today = currentDate.getDay();
                setCurrentDay(days[today]);
                setNextDays(
                  nextDays
                    .slice(today + 1)
                    .concat(nextDays.slice(0, 0).reverse())
                );
                setNextDaysMaxTemp(
                  response.daily.temperature_2m_max
                    .slice(today + 1)
                    .concat(
                      response.daily.temperature_2m_max.slice(0, 0).reverse()
                    )
                );
                setNextDaysMinTemp(
                  response.daily.temperature_2m_min
                    .slice(today + 1)
                    .concat(
                      response.daily.temperature_2m_min.slice(0, 0).reverse()
                    )
                );

                if (
                  response.current.weather_code === 1 ||
                  response.current.weather_code === 0
                ) {
                  setStatus("Clear");
                  setWeatherIcon(
                    <TiWeatherNight className="animate-pulse invert" />
                  );
                } else if (
                  response.current.weather_code === 2 ||
                  response.current.weather_code === 3
                ) {
                  setStatus("Mainly clear");
                  setWeatherIcon(
                    <TiWeatherPartlySunny className="animate-pulse invert" />
                  );
                } else if (
                  response.current.weather_code === 4 ||
                  response.current.weather_code === 5
                ) {
                  setStatus("Partly Cloudy clear");
                  setWeatherIcon(
                    <TiWeatherNight className="animate-pulse invert" />
                  );
                } else {
                  setError("Error: No weather data received");
                }
              }
            }, i * 2000);
          }
        } else {
          setError("Error: No geolocation data received");
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <WeatherCard
      temperature={temperature}
      loading={loading}
      status={status}
      wind={wind}
      rain={rain}
      cloudcover={cloudcover}
      error={error}
      weatherIcon={weatherIcon}
      currentDay={currentDay}
      days={days}
      nextDays={nextDays}
      nextDaysMaxTemp={nextDaysMaxTemp}
      nextDaysMinTemp={nextDaysMinTemp}
      cityLongitude={cityLongitude}
      cityLatitude={cityLatitude}
      city={city}
    />
  );
};

export default HomePage;
